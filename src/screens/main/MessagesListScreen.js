import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, StatusBar, RefreshControl, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const MessagesListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // --- BUSCA INTELIGENTE (JOGADOR + HOST) ---
  const fetchConversations = async () => {
    try {
      // 1. Busca jogos onde sou JOGADOR (Participante)
      const participantsPromise = supabase
        .from('game_participants')
        .select(`
          games (
            id,
            title,
            image_url,
            date,
            mode,
            host_id
          )
        `)
        .eq('user_id', user.id);

      // 2. Busca jogos onde sou DONO (Host)
      const hostedPromise = supabase
        .from('games')
        .select(`
            id,
            title,
            image_url,
            date,
            mode,
            host_id
        `)
        .eq('host_id', user.id);

      // Roda as duas buscas ao mesmo tempo (mais rápido)
      const [participantsResponse, hostedResponse] = await Promise.all([
        participantsPromise,
        hostedPromise
      ]);

      if (participantsResponse.error) throw participantsResponse.error;
      if (hostedResponse.error) throw hostedResponse.error;

      // --- MISTURAR E REMOVER DUPLICADOS ---
      // Se eu sou Host E Jogador ao mesmo tempo, o jogo viria duplicado. Vamos evitar isso.
      
      const jogosComoParticipante = participantsResponse.data
        .map(item => item.games)
        .filter(g => g !== null);
      
      const jogosComoHost = hostedResponse.data || [];

      // Map é uma estrutura que não aceita chaves duplicadas. Usamos o ID do jogo como chave.
      const mapaDeJogos = new Map();

      // Adiciona jogos onde sou participante
      jogosComoParticipante.forEach(game => mapaDeJogos.set(game.id, game));
      
      // Adiciona jogos onde sou host (se já existir, ele sobrescreve, o que dá na mesma)
      jogosComoHost.forEach(game => mapaDeJogos.set(game.id, game));

      // Converte de volta para Array e ordena pelo ID (ou data) decrescente
      const listaFinal = Array.from(mapaDeJogos.values()).sort((a, b) => b.id - a.id);

      setConversations(listaFinal);

    } catch (error) {
      console.log("Erro inbox:", error.message);
      // Alert.alert("Erro", error.message); // Opcional
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchConversations();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark pt-8">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="px-5 mb-6">
        <Text className="text-gray-400 font-body text-xs uppercase tracking-widest">Suas Conversas</Text>
        <Text className="text-white text-3xl font-display font-bold">Inbox</Text>
      </View>

      {/* Lista */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
           <ActivityIndicator size="large" color="#f9f506" />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f9f506" />
          }
          ListEmptyComponent={() => (
            <View className="items-center justify-center mt-20 px-10">
               <MaterialIcons name="forum" size={64} color="#333" />
               <Text className="text-gray-400 mt-4 text-center font-body text-base">
                 Nenhuma conversa encontrada.
               </Text>
               <Text className="text-gray-600 text-center text-sm mt-2">
                 Crie um jogo ou participe de um para começar a conversar.
               </Text>
            </View>
          )}
          renderItem={({ item }) => {
            const isHost = item.host_id === user.id;

            return (
              <TouchableOpacity 
                className="flex-row items-center bg-surface-dark p-4 mb-3 rounded-2xl border border-white/5 active:bg-gray-800"
                onPress={() => navigation.navigate('Chat', { gameId: item.id, title: item.title })}
              >
                {/* Foto do Jogo */}
                <View className="relative">
                   <Image 
                      source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1622163642998-1ea36b1ad565?q=80' }} 
                      className="w-14 h-14 rounded-full bg-gray-700"
                   />
                   {/* Badge se for Host */}
                   {isHost && (
                     <View className="absolute -top-1 -left-1 bg-primary rounded-full px-1.5 py-0.5 border-2 border-background-dark">
                        <Text className="text-[8px] font-bold text-black">HOST</Text>
                     </View>
                   )}
                </View>
  
                {/* Textos */}
                <View className="flex-1 ml-4 justify-center">
                   <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-white font-bold text-base flex-1 mr-2" numberOfLines={1}>
                          {item.title}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                          {item.date?.split(' - ')[1] || 'Hoje'}
                      </Text>
                   </View>
                   
                   <View className="flex-row items-center">
                      {isHost ? (
                        <MaterialIcons name="campaign" size={14} color="#f9f506" />
                      ) : (
                        <MaterialIcons name="reply" size={14} color="#6b6b60" style={{ transform: [{ scaleX: -1 }] }} />
                      )}
                      
                      <Text className={`text-sm ml-1 ${isHost ? 'text-gray-300' : 'text-gray-400'}`} numberOfLines={1}>
                         {isHost ? 'Gerencie o chat do seu evento...' : 'Toque para abrir o chat...'}
                      </Text>
                   </View>
                </View>
  
                <MaterialIcons name="chevron-right" size={24} color="#333" />
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default MessagesListScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const ManageGameScreen = ({ route, navigation }) => {
  const { gameId } = route.params;
  
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [dateString, setDateString] = useState(''); // Vamos tratar como string simples pra facilitar
  const [participants, setParticipants] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Carrega dados do jogo e participantes
  useEffect(() => {
    fetchGameDetails();
  }, []);

  const fetchGameDetails = async () => {
    try {
      // 1. Pega dados do jogo
      const { data: game, error: gameError } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .single();
      
      if (gameError) throw gameError;

      setTitle(game.title);
      setLocation(game.location);
      setDateString(game.date);

      // 2. Pega participantes
      const { data: parts, error: partError } = await supabase
        .from('game_participants')
        .select('id, user_id, profiles(full_name, avatar_url)')
        .eq('game_id', gameId);

      if (partError) throw partError;
      setParticipants(parts);

    } catch (error) {
      Alert.alert("Erro", error.message);
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title || !location || !dateString) return Alert.alert("Erro", "Preencha todos os campos");
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('games')
        .update({
          title,
          location,
          date: dateString,
        })
        .eq('id', gameId);

      if (error) throw error;
      Alert.alert("Sucesso", "Jogo atualizado!");
      navigation.goBack(); // Volta para os detalhes

    } catch (error) {
      Alert.alert("Erro ao atualizar", error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleKickPlayer = (userId, userName) => {
    Alert.alert(
      "Remover Jogador",
      `Deseja remover ${userName} da partida?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive", 
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('game_participants')
                .delete()
                .eq('game_id', gameId)
                .eq('user_id', userId);
              
              if (error) throw error;
              
              // Atualiza a lista local removendo o item
              setParticipants(prev => prev.filter(p => p.user_id !== userId));
              Alert.alert("Removido", `${userName} saiu do jogo.`);

            } catch (e) {
              Alert.alert("Erro", e.message);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
        <View className="flex-1 bg-background-dark justify-center items-center">
            <ActivityIndicator size="large" color="#f9f506" />
        </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center bg-surface-dark rounded-full">
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white font-bold text-lg mr-10">Gerenciar Jogo</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          
          {/* Seção de Edição */}
          <Text className="text-primary font-bold mb-4 text-sm uppercase">Editar Informações</Text>
          
          <View className="mb-4">
             <Text className="text-gray-400 text-xs mb-2">Título</Text>
             <TextInput 
                value={title}
                onChangeText={setTitle}
                className="bg-surface-dark text-white p-4 rounded-xl border border-white/10 font-bold"
             />
          </View>

          <View className="mb-4">
             <Text className="text-gray-400 text-xs mb-2">Local</Text>
             <TextInput 
                value={location}
                onChangeText={setLocation}
                className="bg-surface-dark text-white p-4 rounded-xl border border-white/10"
             />
          </View>

          <View className="mb-8">
             <Text className="text-gray-400 text-xs mb-2">Data e Hora (Texto)</Text>
             <TextInput 
                value={dateString}
                onChangeText={setDateString}
                className="bg-surface-dark text-white p-4 rounded-xl border border-white/10"
             />
          </View>

          {/* Seção de Jogadores */}
          <Text className="text-primary font-bold mb-4 text-sm uppercase">Gerenciar Jogadores ({participants.length})</Text>
          
          {participants.map((p) => (
             <View key={p.id} className="flex-row items-center justify-between bg-surface-dark p-3 rounded-xl mb-3 border border-white/5">
                <View className="flex-row items-center flex-1">
                   <Image 
                     source={{ uri: `https://api.dicebear.com/7.x/initials/png?seed=${p.profiles?.full_name || 'U'}` }} 
                     className="w-10 h-10 rounded-full bg-gray-600" 
                   />
                   <Text className="text-white ml-3 font-bold" numberOfLines={1}>{p.profiles?.full_name}</Text>
                </View>
                
                <TouchableOpacity 
                   onPress={() => handleKickPlayer(p.user_id, p.profiles?.full_name)}
                   className="bg-red-500/10 p-2 rounded-full border border-red-500/50"
                >
                   <MaterialIcons name="person-remove" size={20} color="#ef4444" />
                </TouchableOpacity>
             </View>
          ))}
          
          <View className="h-20" />
      </ScrollView>

      {/* Footer Salvar */}
      <View className="p-6 bg-background-dark border-t border-white/5">
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={saving}
            className="w-full h-14 bg-primary rounded-full items-center justify-center shadow-lg"
          >
            {saving ? <ActivityIndicator color="black" /> : (
               <Text className="text-black font-bold text-lg">Salvar Alterações</Text>
            )}
          </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default ManageGameScreen;
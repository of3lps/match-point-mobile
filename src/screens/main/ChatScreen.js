import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const ChatScreen = ({ route, navigation }) => {
  const { gameId, title } = route.params;
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const flatListRef = useRef(null);

  useEffect(() => {
    // 1. Busca mensagens antigas
    fetchMessages();

    // 2. Cria o canal de escuta (Realtime)
    const channel = supabase
      .channel(`game_chat:${gameId}`) // Nome único para este chat
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Escuta apenas novas mensagens
          schema: 'public',
          table: 'messages',
          filter: `game_id=eq.${gameId}`, // Apenas mensagens DESTE jogo
        },
        (payload) => {
          // Quando uma mensagem nova chega...
          const newMsgId = payload.new.id;
          
          // Verifica se já não temos essa mensagem (para evitar duplicidade local)
          setMessages((currentMessages) => {
             const exists = currentMessages.some(m => m.id === newMsgId);
             if (exists) return currentMessages;

             // Precisamos buscar os dados do autor (nome/foto) porque o Realtime só manda o ID
             fetchMessageAuthor(payload.new).then(fullMessage => {
                setMessages(prev => [fullMessage, ...prev]);
             });
             
             return currentMessages;
          });
        }
      )
      .subscribe();

    // Limpeza ao sair da tela
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  // Função auxiliar para buscar dados do autor quando chega msg nova via Realtime
  const fetchMessageAuthor = async (messageRaw) => {
      const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', messageRaw.user_id)
          .single();
      
      return {
          ...messageRaw,
          profiles: data // Anexa o perfil à mensagem
      };
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false }); // Do mais novo para o mais velho

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const textToSend = newMessage.trim();
    setNewMessage(''); // Limpa o input imediatamente (UX rápida)

    try {
      // Envia para o banco
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            game_id: gameId,
            user_id: user.id,
            content: textToSend,
          }
        ]);

      if (error) throw error;
      // Não precisamos adicionar manualmente na lista aqui, 
      // porque o Realtime vai "ouvir" a nossa própria mensagem e adicionar!

    } catch (error) {
      console.log("Erro ao enviar:", error.message);
      Alert.alert("Erro", "Não foi possível enviar a mensagem.");
    }
  };

  // Renderização de cada balão de mensagem
  const renderItem = ({ item }) => {
    const isMe = item.user_id === user.id;

    return (
      <View className={`flex-row mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
        {!isMe && (
           <Image 
             source={{ uri: item.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/png?seed=${item.profiles?.full_name}` }} 
             className="w-8 h-8 rounded-full bg-gray-600 mr-2 mt-1"
           />
        )}
        
        <View 
            className={`px-4 py-3 rounded-2xl max-w-[75%] ${
                isMe ? 'bg-primary rounded-tr-none' : 'bg-surface-dark border border-white/10 rounded-tl-none'
            }`}
        >
            {!isMe && (
                <Text className="text-xs text-gray-400 font-bold mb-1">{item.profiles?.full_name?.split(' ')[0]}</Text>
            )}
            <Text className={`text-base ${isMe ? 'text-black font-medium' : 'text-white'}`}>
                {item.content}
            </Text>
            <Text className={`text-[10px] mt-1 text-right ${isMe ? 'text-black/60' : 'text-gray-500'}`}>
                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-white/5 bg-background-dark z-10">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
            <Text className="text-white font-bold text-lg" numberOfLines={1}>{title}</Text>
            <Text className="text-primary text-xs font-bold">Chat do Grupo</Text>
        </View>
      </View>

      {/* Lista de Mensagens */}
      {loading ? (
          <View className="flex-1 justify-center items-center">
              <ActivityIndicator color="#f9f506" />
          </View>
      ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            className="flex-1 px-4 pt-4"
            inverted // Inverte a lista para começar de baixo
            contentContainerStyle={{ paddingBottom: 20 }}
          />
      )}

      {/* Input de Mensagem */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View className="flex-row items-center p-4 bg-surface-dark border-t border-white/5">
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#666"
            multiline
            className="flex-1 bg-background-dark text-white rounded-full px-5 py-3 mr-3 max-h-24 border border-white/10 font-body"
          />
          <TouchableOpacity 
            onPress={handleSend}
            disabled={!newMessage.trim()}
            className={`w-12 h-12 rounded-full items-center justify-center ${newMessage.trim() ? 'bg-primary' : 'bg-gray-700'}`}
          >
            <MaterialIcons name="send" size={24} color={newMessage.trim() ? 'black' : 'gray'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
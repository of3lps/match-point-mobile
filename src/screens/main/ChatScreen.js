import React, { useState, useEffect, useRef } from 'react';
import { View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const ChatScreen = ({ route, navigation }) => {
  // Recebemos o gameId (para saber qual sala é) e o title (para o cabeçalho)
  // Se vier "name", é fallback. O ideal é passarmos o objeto game ou gameId.
  const { gameId, title } = route.params || {}; 
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);

  // Se não tiver gameId, não tem chat (ex: chat direto futuro)
  // Por enquanto, vamos assumir que sempre vem de um jogo.

  useEffect(() => {
    if (!gameId) return;

    // 1. Carregar mensagens iniciais
    fetchMessages();

    // 2. Inscrever-se no canal de Tempo Real do Supabase
    const channel = supabase
      .channel(`game_chat:${gameId}`) // Nome único do canal
      .on(
        'postgres_changes',
        {
          event: 'INSERT', // Escutar apenas novas inserções
          schema: 'public',
          table: 'messages',
          filter: `game_id=eq.${gameId}`, // Apenas mensagens DESTE jogo
        },
        (payload) => {
          // Quando chegar uma mensagem nova, buscar quem enviou
          handleNewMessage(payload.new);
        }
      )
      .subscribe();

    // Limpeza ao sair da tela
    return () => {
      supabase.removeChannel(channel);
    };
  }, [gameId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, 
          content, 
          created_at, 
          user_id,
          profiles:user_id (full_name) 
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: true }); // Mais antigas primeiro

      if (error) throw error;
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.log('Erro ao carregar chat:', error);
      setLoading(false);
    }
  };

  // Função auxiliar para processar mensagem recebida em tempo real
  const handleNewMessage = async (newMessage) => {
    // A mensagem realtime não traz o "profiles(full_name)", precisamos buscar ou pegar do cache.
    // Para simplificar, vamos buscar o nome do remetente rapidinho
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', newMessage.user_id)
      .single();

    const formattedMsg = {
      ...newMessage,
      profiles: { full_name: data?.full_name || 'Usuário' }
    };

    setMessages((prev) => [...prev, formattedMsg]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const textToSend = inputText;
    setInputText(''); // Limpa input imediatamente para UX rápida

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            game_id: gameId,
            user_id: user.id,
            content: textToSend,
          },
        ]);

      if (error) throw error;
      // Não precisamos adicionar manualmente na lista, o "channel.on" vai pegar o retorno e adicionar!
    } catch (error) {
      console.log('Erro ao enviar:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-white/5 bg-surface-dark">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-white font-bold text-lg" numberOfLines={1}>{title || "Chat do Jogo"}</Text>
          <Text className="text-primary text-xs">Online</Text>
        </View>
        <TouchableOpacity>
           <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
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
          keyExtractor={(item) => item.id.toString()}
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 20 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          renderItem={({ item }) => {
            const isMe = item.user_id === user.id;
            return (
              <View className={`mb-4 w-full flex-row ${isMe ? 'justify-end' : 'justify-start'}`}>
                 <View className={`max-w-[80%] p-3 rounded-2xl ${
                     isMe ? 'bg-primary rounded-tr-none' : 'bg-surface-dark border border-white/10 rounded-tl-none'
                 }`}>
                     {!isMe && (
                         <Text className="text-gray-400 text-xs font-bold mb-1">
                             {item.profiles?.full_name?.split(' ')[0] || 'Alguém'}
                         </Text>
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
          }}
        />
      )}

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
          <View className="flex-row items-center p-4 bg-surface-dark border-t border-white/5">
             <TextInput 
                value={inputText}
                onChangeText={setInputText}
                placeholder="Digite sua mensagem..."
                placeholderTextColor="#6b6b60"
                className="flex-1 bg-background-dark text-white rounded-full py-3 px-4 mr-3 border border-white/10"
             />
             <TouchableOpacity 
                onPress={handleSend}
                disabled={!inputText.trim()}
                className={`w-12 h-12 rounded-full items-center justify-center ${
                    inputText.trim() ? 'bg-primary' : 'bg-gray-700'
                }`}
             >
                <MaterialIcons name="send" size={24} color={inputText.trim() ? 'black' : 'gray'} />
             </TouchableOpacity>
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
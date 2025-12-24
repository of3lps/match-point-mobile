import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const INITIAL_MESSAGES = [
  { id: '1', text: 'E aí, tudo certo para o jogo amanhã?', sender: 'them', time: '10:30' },
  { id: '2', text: 'Opa, tudo certo! Levo as bolas.', sender: 'me', time: '10:32' },
  { id: '3', text: 'Fechado! Nos vemos na quadra 3.', sender: 'them', time: '10:33' },
];

const ChatScreen = ({ navigation, route }) => {
  const { name = "Rafael (Host)", image } = route.params || {};
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim().length === 0) return;
    const newMsg = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header do Chat */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-800 bg-surface-dark">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
           <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Image 
          source={{ uri: image || 'https://images.unsplash.com/photo-1599474924187-334a405be2fa?q=80' }} 
          className="w-10 h-10 rounded-full bg-gray-700 mr-3"
        />
        
        <View className="flex-1">
           <Text className="text-white font-bold text-base">{name}</Text>
           <Text className="text-primary text-xs">Online agora</Text>
        </View>

        <TouchableOpacity className="mr-4">
           <MaterialIcons name="phone" size={24} color="#6b6b60" />
        </TouchableOpacity>
        <TouchableOpacity>
           <MaterialIcons name="more-vert" size={24} color="#6b6b60" />
        </TouchableOpacity>
      </View>

      {/* Lista de Mensagens */}
      <FlatList
        data={[...messages].reverse()} // Inverter para mostrar a mais recente embaixo (com inverted no FlatList)
        inverted
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className={`mb-3 max-w-[80%] ${item.sender === 'me' ? 'self-end' : 'self-start'}`}>
             <View 
               className={`p-3 rounded-2xl 
                 ${item.sender === 'me' 
                   ? 'bg-primary rounded-tr-none' 
                   : 'bg-surface-dark border border-gray-700 rounded-tl-none'
                 }`}
             >
                <Text className={`text-sm ${item.sender === 'me' ? 'text-black font-medium' : 'text-white'}`}>
                  {item.text}
                </Text>
             </View>
             <Text className="text-gray-500 text-[10px] mt-1 self-end">{item.time}</Text>
          </View>
        )}
      />

      {/* Input de Texto */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View className="flex-row items-center p-3 bg-surface-dark border-t border-gray-800">
           <TouchableOpacity className="mr-3">
              <MaterialIcons name="add-circle" size={28} color="#6b6b60" />
           </TouchableOpacity>
           
           <TextInput
             value={inputText}
             onChangeText={setInputText}
             placeholder="Digite uma mensagem..."
             placeholderTextColor="#6b6b60"
             className="flex-1 bg-background-dark text-white rounded-full py-3 px-4 font-body border border-gray-800 focus:border-primary max-h-24"
             multiline
           />
           
           <TouchableOpacity 
             onPress={handleSend}
             className={`ml-3 w-12 h-12 rounded-full items-center justify-center ${inputText.trim() ? 'bg-primary' : 'bg-gray-800'}`}
           >
              <MaterialIcons name="send" size={20} color={inputText.trim() ? 'black' : '#6b6b60'} />
           </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;
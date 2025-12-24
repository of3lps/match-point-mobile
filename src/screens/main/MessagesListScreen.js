import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// --- ESTA É A LISTA QUE ESTAVA FALTANDO ---
const MESSAGES = [
  { id: '1', name: 'Grupo: Tênis Sábado', lastMsg: 'Rafael: Eu levo as bolas!', time: '10:30', unread: 2, image: 'https://images.unsplash.com/photo-1599474924187-334a405be2fa?q=80' },
  { id: '2', name: 'Ana Souza', lastMsg: 'Combinado então!', time: 'Ontem', unread: 0, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80' },
  { id: '3', name: 'Carlos Tennis Coach', lastMsg: 'Tem horário livre na quinta?', time: 'Terça', unread: 0, image: 'https://i.pravatar.cc/150?img=11' },
];

const MessagesListScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="px-5 pt-4 pb-2 flex-row justify-between items-center">
        <Text className="text-white text-3xl font-display font-bold">Mensagens</Text>
        <TouchableOpacity>
           <MaterialIcons name="edit-square" size={24} color="#f9f506" />
        </TouchableOpacity>
      </View>

      {/* Lista */}
      <FlatList
        data={MESSAGES}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity 
            className="flex-row items-center mb-6 active:opacity-70"
            // Navegação para o Chat passando nome e foto
            onPress={() => navigation.navigate('Chat', { name: item.name, image: item.image })}
          >
             <View className="relative">
                <Image source={{ uri: item.image }} className="w-14 h-14 rounded-full bg-gray-700" />
                {item.unread > 0 && (
                   <View className="absolute -top-1 -right-1 bg-primary w-5 h-5 rounded-full items-center justify-center border-2 border-background-dark">
                      <Text className="text-black text-[10px] font-bold">{item.unread}</Text>
                   </View>
                )}
             </View>
             
             <View className="flex-1 ml-4 border-b border-gray-800 pb-4">
                <View className="flex-row justify-between items-center mb-1">
                   <Text className="text-white font-bold text-base">{item.name}</Text>
                   <Text className="text-gray-500 text-xs">{item.time}</Text>
                </View>
                <Text numberOfLines={1} className={item.unread > 0 ? "text-white font-semibold" : "text-gray-400"}>
                   {item.lastMsg}
                </Text>
             </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

export default MessagesListScreen;
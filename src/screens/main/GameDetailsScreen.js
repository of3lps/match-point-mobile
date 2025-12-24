import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Dados Mockados dos Jogadores
const PLAYERS = [
  { id: 1, name: 'Rafael (Host)', role: 'Host', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' },
  { id: 2, name: 'Ana Souza', role: 'Confirmado', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200' },
  { id: 3, name: 'Vaga Livre', role: 'Disponível', image: null },
  { id: 4, name: 'Vaga Livre', role: 'Disponível', image: null },
];

const PlayerCircle = ({ player }) => (
  <View className="items-center mr-4">
    {player.image ? (
      <Image source={{ uri: player.image }} className="w-16 h-16 rounded-full border-2 border-primary" />
    ) : (
      <View className="w-16 h-16 rounded-full bg-surface-dark border-2 border-dashed border-gray-600 items-center justify-center">
        <MaterialIcons name="add" size={24} color="#6b6b60" />
      </View>
    )}
    <Text className="text-white text-xs mt-2 font-medium">{player.name.split(' ')[0]}</Text>
    <Text className="text-gray-500 text-[10px] uppercase">{player.role}</Text>
  </View>
);

const GameDetailsScreen = ({ navigation, route }) => {
  // Recebe dados da tela anterior (se houver) ou usa defaults
  const { title = "Parque Ibirapuera", date = "Amanhã, 08:00" } = route.params || {};
  const [status, setStatus] = useState('idle'); // idle, requesting, confirmed

  const handleJoin = () => {
    setStatus('requesting');
    // Aqui viria a lógica de backend
    setTimeout(() => setStatus('confirmed'), 1500); // Simula aprovação
  };

  return (
    <View className="flex-1 bg-background-dark">
      <StatusBar barStyle="light-content" />
      
      {/* Imagem de Capa */}
      <View className="h-64 w-full relative">
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80' }} 
          className="w-full h-full opacity-80"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-background-dark to-transparent" />
        
        <SafeAreaView className="absolute top-0 w-full px-4 pt-2">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-black/40 items-center justify-center backdrop-blur-md">
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      <View className="flex-1 px-5 -mt-8">
        <View className="bg-surface-dark p-5 rounded-2xl shadow-lg border border-white/5">
            <Text className="text-primary text-sm font-bold uppercase tracking-wider mb-1">Partida Amistosa</Text>
            <Text className="text-white text-2xl font-display font-bold leading-tight">{title}</Text>
            
            <View className="flex-row items-center gap-2 mt-3">
               <MaterialIcons name="calendar-today" size={16} color="#8c8b5f" />
               <Text className="text-gray-300">{date}</Text>
            </View>
            <View className="flex-row items-center gap-2 mt-2">
               <MaterialIcons name="location-on" size={16} color="#8c8b5f" />
               <Text className="text-gray-300">Quadra 3 • Cimento (Rápida)</Text>
            </View>
        </View>

        <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
           <Text className="text-white text-lg font-bold mb-4">Jogadores (2/4)</Text>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-4">
              {PLAYERS.map(p => <PlayerCircle key={p.id} player={p} />)}
           </ScrollView>

           <View className="h-[1px] bg-gray-800 my-4" />

           <Text className="text-white text-lg font-bold mb-2">Sobre o Jogo</Text>
           <Text className="text-gray-400 leading-relaxed font-body">
             Olá pessoal! Buscamos mais 2 jogadores nível intermediário para fechar uma dupla. 
             O clima é amigável, mas gostamos de jogar valendo os pontos. Temos bolas novas!
           </Text>
           
           <View className="h-24" /> 
        </ScrollView>
      </View>

      {/* Footer Fixo */}
      <View className="absolute bottom-0 w-full bg-surface-dark border-t border-gray-800 p-5 pb-8">
         <TouchableOpacity 
           onPress={handleJoin}
           disabled={status !== 'idle'}
           className={`w-full py-4 rounded-full flex-row items-center justify-center gap-2 shadow-lg transition-all
             ${status === 'confirmed' ? 'bg-green-500' : (status === 'requesting' ? 'bg-gray-600' : 'bg-primary')}
           `}
         >
            {status === 'idle' && (
              <>
                <Text className="text-black font-bold text-lg">Pedir para Participar</Text>
                <MaterialIcons name="front-hand" size={20} color="black" />
              </>
            )}
            {status === 'requesting' && <Text className="text-white font-bold text-lg">Enviando pedido...</Text>}
            {status === 'confirmed' && (
              <>
                <Text className="text-white font-bold text-lg">Você está no jogo!</Text>
                <MaterialIcons name="check" size={20} color="white" />
              </>
            )}
         </TouchableOpacity>
      </View>
    </View>
  );
};

export default GameDetailsScreen;
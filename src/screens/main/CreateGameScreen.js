import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const CreateGameScreen = ({ navigation }) => {
  const [gameMode, setGameMode] = useState('double');
  const [level, setLevel] = useState('intermediario');
  const [locationType, setLocationType] = useState('club');

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center rounded-full bg-white/5">
          <MaterialIcons name="arrow-back-ios" size={20} color="white" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white text-lg font-display font-bold mr-10">Novo Jogo</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
            <Text className="text-white text-3xl font-display font-bold mb-1">Vamos jogar?</Text>
            <Text className="text-text-muted text-sm">Configure sua partida de tênis.</Text>
        </View>

        {/* Localização */}
        <View className="mb-8">
           <Text className="text-white text-lg font-bold mb-3">Onde será a partida?</Text>
           <View className="flex-row bg-surface-dark p-1 rounded-full border border-white/10 mb-4">
              <TouchableOpacity 
                onPress={() => setLocationType('club')}
                className={`flex-1 py-2.5 rounded-full items-center ${locationType === 'club' ? 'bg-primary' : 'bg-transparent'}`}
              >
                 <Text className={`font-semibold text-sm ${locationType === 'club' ? 'text-black' : 'text-gray-400'}`}>Clube Parceiro</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setLocationType('public')}
                className={`flex-1 py-2.5 rounded-full items-center ${locationType === 'public' ? 'bg-primary' : 'bg-transparent'}`}
              >
                 <Text className={`font-semibold text-sm ${locationType === 'public' ? 'text-black' : 'text-gray-400'}`}>Local Público</Text>
              </TouchableOpacity>
           </View>
           <View className="relative">
              <MaterialIcons name="search" size={24} color="#6b6b60" style={{ position: 'absolute', left: 16, top: 14, zIndex:1 }} />
              <TextInput 
                placeholder="Buscar clube ou quadra"
                placeholderTextColor="#6b6b60"
                className="bg-surface-dark text-white rounded-2xl py-4 pl-12 pr-4 font-body border border-transparent focus:border-primary"
              />
           </View>
        </View>

        {/* Modalidade */}
        <View className="mb-8">
           <Text className="text-white text-lg font-bold mb-3">Modalidade</Text>
           <View className="flex-row gap-3">
              <TouchableOpacity 
                onPress={() => setGameMode('single')}
                className={`flex-1 h-32 rounded-2xl items-center justify-center border-2 ${gameMode === 'single' ? 'bg-surface-dark border-primary' : 'bg-surface-dark border-transparent'}`}
              >
                 <View className="flex-row -space-x-2 mb-2">
                    <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center border border-surface-dark z-10"><MaterialIcons name="person" size={16} color="#f9f506" /></View>
                    <View className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center border border-surface-dark"><MaterialIcons name="person" size={16} color="#9ca3af" /></View>
                 </View>
                 <Text className="text-white font-bold text-sm">Simples (2)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => setGameMode('double')}
                className={`flex-1 h-32 rounded-2xl items-center justify-center border-2 ${gameMode === 'double' ? 'bg-surface-dark border-primary' : 'bg-surface-dark border-transparent'}`}
              >
                 <View className="flex-row -space-x-2 mb-2">
                    <View className="w-8 h-8 rounded-full bg-primary/20 items-center justify-center border border-surface-dark z-20"><MaterialIcons name="groups" size={16} color="#f9f506" /></View>
                    <View className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center border border-surface-dark z-10"><MaterialIcons name="groups" size={16} color="#9ca3af" /></View>
                    <View className="w-8 h-8 rounded-full bg-gray-700 items-center justify-center border border-surface-dark"><MaterialIcons name="groups" size={16} color="#9ca3af" /></View>
                 </View>
                 <Text className="text-white font-bold text-sm">Duplas (4)</Text>
                 {gameMode === 'double' && (
                    <View className="absolute top-2 right-2">
                       <MaterialIcons name="check-circle" size={20} color="#f9f506" />
                    </View>
                 )}
              </TouchableOpacity>
           </View>
        </View>

        {/* Data e Hora */}
        <View className="mb-8">
           <View className="flex-row justify-between items-center mb-3">
              <Text className="text-white text-lg font-bold">Quando?</Text>
              <Text className="text-primary text-sm font-bold">Ver Calendário</Text>
           </View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-3 mb-4">
              <TouchableOpacity className="w-16 h-20 bg-primary rounded-xl items-center justify-center shadow-lg">
                 <Text className="text-black text-xs font-bold uppercase opacity-70">Hoje</Text>
                 <Text className="text-black text-xl font-bold">14</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-16 h-20 bg-surface-dark rounded-xl items-center justify-center border border-white/5">
                 <Text className="text-gray-400 text-xs font-bold uppercase opacity-60">Sáb</Text>
                 <Text className="text-white text-xl font-bold">15</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-16 h-20 bg-surface-dark rounded-xl items-center justify-center border border-white/5">
                 <Text className="text-gray-400 text-xs font-bold uppercase opacity-60">Dom</Text>
                 <Text className="text-white text-xl font-bold">16</Text>
              </TouchableOpacity>
           </ScrollView>
           
           <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
                {['07:00', '08:00', '09:00', '10:00', '11:00'].map((time, i) => (
                    <TouchableOpacity key={i} className={`px-5 py-2.5 rounded-full border ${time === '09:00' ? 'bg-primary border-primary' : 'bg-transparent border-gray-700'}`}>
                        <Text className={`text-sm font-bold ${time === '09:00' ? 'text-black' : 'text-gray-300'}`}>{time}</Text>
                    </TouchableOpacity>
                ))}
           </ScrollView>
        </View>

        <View className="h-24"></View>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-dark via-background-dark to-transparent pb-8 pt-10">
         <TouchableOpacity 
            className="w-full bg-primary py-4 rounded-full flex-row items-center justify-center gap-2 shadow-lg shadow-primary/20"
            onPress={() => navigation.goBack()} // Simula criar e voltar
         >
            <Text className="text-black font-bold text-lg">Publicar Jogo</Text>
            <MaterialIcons name="sports-tennis" size={24} color="black" />
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateGameScreen;
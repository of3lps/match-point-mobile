import React from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const StatBox = ({ label, value }) => (
  <View className="flex-1 bg-surface-dark p-3 rounded-xl items-center border border-white/5">
    <Text className="text-primary text-xl font-display font-bold">{value}</Text>
    <Text className="text-gray-400 text-xs uppercase mt-1 font-bold tracking-wider">{label}</Text>
  </View>
);

const MenuItem = ({ icon, label, isDestructive }) => (
  <TouchableOpacity className="flex-row items-center justify-between bg-surface-dark p-4 rounded-xl border border-white/5 mb-3 active:bg-gray-800">
    <View className="flex-row items-center gap-3">
        <MaterialIcons name={icon} size={24} color={isDestructive ? '#ef4444' : '#8c8b5f'} />
        <Text className={`font-medium text-base ${isDestructive ? 'text-red-500' : 'text-white'}`}>{label}</Text>
    </View>
    {!isDestructive && <MaterialIcons name="chevron-right" size={24} color="#6b6b60" />}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header Perfil */}
        <View className="items-center mt-4 mb-8">
          <View className="relative">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' }} 
              className="w-28 h-28 rounded-full border-4 border-primary"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-black p-2 rounded-full border border-gray-700">
               <MaterialIcons name="edit" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-white text-2xl font-display font-bold mt-4">Rafael Silva</Text>
          <Text className="text-gray-400 font-body">São Paulo, SP</Text>
          
          <View className="flex-row gap-2 mt-4">
             <View className="bg-surface-dark px-3 py-1 rounded-full border border-gray-700">
                <Text className="text-primary text-xs font-bold">NTRP 4.0</Text>
             </View>
             <View className="bg-surface-dark px-3 py-1 rounded-full border border-gray-700">
                <Text className="text-white text-xs">Destro</Text>
             </View>
             <View className="bg-surface-dark px-3 py-1 rounded-full border border-gray-700">
                <Text className="text-white text-xs">Revés 2 Mãos</Text>
             </View>
          </View>
        </View>

        {/* Estatísticas */}
        <View className="flex-row gap-3 mb-8">
          <StatBox label="Jogos" value="42" />
          <StatBox label="Vitórias" value="28" />
          <StatBox label="Win Rate" value="66%" />
        </View>

        {/* Menu Opções */}
        <View className="mb-10">
           <Text className="text-white text-lg font-bold mb-4 ml-1">Conta</Text>
           
           <MenuItem icon="history" label="Histórico de Jogos" />
           <MenuItem icon="credit-card" label="Pagamentos" />
           <MenuItem icon="notifications" label="Notificações" />
           <MenuItem icon="settings" label="Configurações" />
           
           <View className="h-4" />
           <MenuItem icon="logout" label="Sair da conta" isDestructive />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
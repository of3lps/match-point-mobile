import React, { useState, useCallback } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../lib/AuthContext'; 
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

const StatBox = ({ label, value }) => (
  <View className="flex-1 bg-surface-dark p-3 rounded-xl items-center border border-white/5">
    <Text className="text-primary text-xl font-display font-bold">{value}</Text>
    <Text className="text-gray-400 text-xs uppercase mt-1 font-bold tracking-wider">{label}</Text>
  </View>
);

const MenuItem = ({ icon, label, isDestructive, onPress }) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between bg-surface-dark p-4 rounded-xl border border-white/5 mb-3 active:bg-gray-800">
    <View className="flex-row items-center gap-3">
        <MaterialIcons name={icon} size={24} color={isDestructive ? '#ef4444' : '#8c8b5f'} />
        <Text className={`font-medium text-base ${isDestructive ? 'text-red-500' : 'text-white'}`}>{label}</Text>
    </View>
    {!isDestructive && <MaterialIcons name="chevron-right" size={24} color="#6b6b60" />}
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { signOut, user, profile: contextProfile } = useAuth(); 
  const [displayProfile, setDisplayProfile] = useState(contextProfile);

  // Recarrega o perfil sempre que a tela aparece
  useFocusEffect(
    useCallback(() => {
      const fetchLatestProfile = async () => {
        if (!user) return;
        // Pega os dados mais frescos do banco
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setDisplayProfile(data);
      };
      fetchLatestProfile();
    }, [user])
  );

  const handleLogout = async () => {
    Alert.alert("Sair", "Deseja desconectar?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: async () => signOut() }
    ]);
  };

  const formattedLevel = displayProfile?.tennis_level 
    ? displayProfile.tennis_level.charAt(0).toUpperCase() + displayProfile.tennis_level.slice(1) : '-';
  const formattedHand = displayProfile?.play_hand
    ? displayProfile.play_hand.charAt(0).toUpperCase() + displayProfile.play_hand.slice(1) : '-';

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="items-center mt-4 mb-8">
          <View className="relative">
            <Image 
              source={{ uri: displayProfile?.avatar_url || `https://api.dicebear.com/7.x/initials/png?seed=${displayProfile?.full_name}` }} 
              className="w-28 h-28 rounded-full border-4 border-primary"
            />
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} className="absolute bottom-0 right-0 bg-black p-2 rounded-full border border-gray-700">
               <MaterialIcons name="edit" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-white text-2xl font-display font-bold mt-4 text-center">{displayProfile?.full_name}</Text> 
          <Text className="text-gray-400 font-body">{user?.email}</Text>
          
          <View className="flex-row gap-2 mt-4">
             <View className="bg-white/10 px-3 py-1 rounded-full"><Text className="text-white text-xs font-bold">{formattedLevel}</Text></View>
             <View className="bg-white/10 px-3 py-1 rounded-full"><Text className="text-white text-xs font-bold">{formattedHand}</Text></View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-8">
           <StatBox value={displayProfile?.matches || 0} label="Jogos" />
           <StatBox value={displayProfile?.wins || 0} label="Vitórias" />
           <StatBox value="-" label="Win Rate" />
        </View>

        {/* Menu */}
        <View className="mb-10">
           <Text className="text-white text-lg font-bold mb-4 ml-1">Conta</Text>
           <MenuItem icon="history" label="Histórico de Jogos" onPress={() => {}} />
           <MenuItem icon="credit-card" label="Pagamentos" onPress={() => {}} />
           <MenuItem icon="notifications" label="Notificações" onPress={() => {}} />
           <MenuItem icon="settings" label="Configurações" onPress={() => {}} />
           <View className="h-4" />
           <MenuItem icon="logout" label="Sair da conta" isDestructive onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
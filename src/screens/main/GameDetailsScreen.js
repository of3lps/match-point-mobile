import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from '@react-navigation/native'; // Importante para recarregar dados

const GameDetailsScreen = ({ route, navigation }) => {
  const { game: initialGameData } = route.params; // Dados iniciais passados pela navegação
  const { user } = useAuth();
  
  // Usamos um estado local para os dados do jogo, para poder atualizar (ex: se mudar horário)
  const [gameData, setGameData] = useState(initialGameData);
  
  const [loading, setLoading] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [hostName, setHostName] = useState("Carregando...");

  const isHost = user?.id === gameData.host_id;

  // Recarrega TUDO (detalhes do jogo + participantes) sempre que a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      fetchGameData();
      fetchParticipants();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const fetchGameData = async () => {
    try {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('id', gameData.id)
            .single();
        
        if (error) throw error;
        if (data) setGameData(data); // Atualiza titulo, local, data na tela

        // Atualiza o nome do host (caso tenha mudado, improvável mas seguro)
        if (data && data.host_id) {
            const { data: host } = await supabase.from('profiles').select('full_name').eq('id', data.host_id).single();
            if (host) setHostName(host.full_name);
        }

    } catch (e) {
        console.log("Erro ao atualizar dados do jogo:", e);
    }
  };

  const fetchParticipants = async () => {
    try {
      const { data, error } = await supabase
        .from('game_participants')
        .select('user_id, profiles(full_name, avatar_url)')
        .eq('game_id', gameData.id);

      if (error) throw error;

      const amIIn = data.some(p => p.user_id === user.id);
      setIsJoined(amIIn);
      setParticipants(data);
    } catch (error) {
      console.log("Erro participants:", error);
    }
  };

  // --- Ações ---

  const handleJoin = async () => {
    setLoading(true);
    try {
        const { error } = await supabase.from('game_participants').insert([
            { game_id: gameData.id, user_id: user.id }
        ]);
        if (error) throw error;
        Alert.alert("Sucesso", "Você entrou no jogo! 🎾");
        fetchParticipants(); 
    } catch (error) {
        Alert.alert("Erro", error.message);
    } finally {
        setLoading(false);
    }
  };

  const handleLeave = async () => {
    setLoading(true);
    try {
        const { error } = await supabase
            .from('game_participants')
            .delete()
            .eq('game_id', gameData.id)
            .eq('user_id', user.id);
        
        if (error) throw error;
        Alert.alert("Saiu", "Você saiu da partida.");
        fetchParticipants();
        setIsJoined(false);
    } catch (error) {
        Alert.alert("Erro", error.message);
    } finally {
        setLoading(false);
    }
  };

  const handleDeleteGame = async () => {
      Alert.alert(
          "Cancelar Partida", 
          "Tem certeza? O jogo será apagado para todos.", 
          [
             { text: "Não", style: "cancel" },
             { 
               text: "Sim, excluir", 
               style: "destructive", 
               onPress: async () => {
                  try {
                      const { error } = await supabase.from('games').delete().eq('id', gameData.id);
                      if (error) throw error;
                      navigation.goBack();
                  } catch (e) {
                      Alert.alert("Erro", "Não foi possível excluir: " + e.message);
                  }
               }
             }
          ]
      );
  };

  const handleManage = () => {
      // Navega para a tela de gestão passando o ID
      navigation.navigate('ManageGame', { gameId: gameData.id });
  };

  return (
    <View className="flex-1 bg-background-dark">
      <StatusBar barStyle="light-content" translucent />

      {/* HEADER FIXO */}
      <SafeAreaView className="absolute top-0 left-0 w-full z-50">
         <View className="px-4 pt-2 flex-row justify-between items-center">
             <TouchableOpacity 
                onPress={() => navigation.goBack()} 
                className="w-10 h-10 bg-black/40 rounded-full items-center justify-center backdrop-blur-md"
             >
                 <MaterialIcons name="arrow-back" size={24} color="white" />
             </TouchableOpacity>

             {isHost && (
                 <TouchableOpacity 
                    onPress={handleDeleteGame} 
                    className="w-10 h-10 bg-red-500/80 rounded-full items-center justify-center shadow-lg"
                 >
                     <MaterialIcons name="delete" size={24} color="white" />
                 </TouchableOpacity>
             )}
         </View>
      </SafeAreaView>

      {/* Imagem de Fundo */}
      <View className="h-72 w-full relative">
         <Image 
            source={{ uri: gameData.image_url || 'https://images.unsplash.com/photo-1622163642998-1ea36b1ad565?q=80' }} 
            className="w-full h-full"
         />
         <View className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background-dark" />
      </View>

      {/* Conteúdo */}
      <ScrollView className="flex-1 -mt-10 px-6" showsVerticalScrollIndicator={false}>
         
         {/* Título e Badges */}
         <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-primary px-3 py-1 rounded-full self-start">
                    <Text className="text-black font-bold text-xs uppercase">{gameData.level}</Text>
                </View>
                <View className="bg-surface-dark px-3 py-1 rounded-full self-start border border-white/10">
                    <Text className="text-white font-bold text-xs uppercase">{gameData.mode === 'double' ? 'Duplas' : 'Simples'}</Text>
                </View>
            </View>
            <Text className="text-white text-3xl font-display font-bold leading-tight">{gameData.title}</Text>
            <View className="flex-row items-center mt-2 opacity-80">
                <MaterialIcons name="location-on" size={18} color="#f9f506" />
                <Text className="text-gray-300 text-base ml-1">{gameData.location}</Text>
            </View>
         </View>

         {/* Host Card */}
         <View className="flex-row items-center mb-6 bg-surface-dark p-3 rounded-2xl border border-white/5">
            <Image source={{ uri: `https://api.dicebear.com/7.x/initials/png?seed=${hostName}` }} className="w-12 h-12 rounded-full bg-gray-700" />
            <View className="ml-3 flex-1">
                <Text className="text-white font-bold text-base">{hostName}</Text>
                <Text className="text-primary text-xs font-bold">ORGANIZADOR</Text>
            </View>
            <TouchableOpacity 
                className="bg-white/10 p-2.5 rounded-full"
                onPress={() => navigation.navigate('Chat', { gameId: gameData.id, title: gameData.title })}
            >
                <MaterialIcons name="chat-bubble" size={20} color="white" />
            </TouchableOpacity>
         </View>

         {/* Informações Grid */}
         <View className="flex-row gap-3 mb-8">
            <View className="flex-1 bg-surface-dark p-4 rounded-2xl border border-white/5 items-center justify-center">
                <MaterialIcons name="event" size={24} color="#f9f506" />
                <Text className="text-white font-bold mt-2">{gameData.date.split(' - ')[0] || 'Data'}</Text>
                <Text className="text-gray-500 text-xs uppercase tracking-wider mt-1">Data</Text>
            </View>
            <View className="flex-1 bg-surface-dark p-4 rounded-2xl border border-white/5 items-center justify-center">
                <MaterialIcons name="schedule" size={24} color="#f9f506" />
                <Text className="text-white font-bold mt-2">{gameData.date.split(' - ')[1] || 'Hora'}</Text>
                <Text className="text-gray-500 text-xs uppercase tracking-wider mt-1">Horário</Text>
            </View>
         </View>

         {/* Lista de Participantes */}
         <View className="mb-32">
            <View className="flex-row justify-between items-end mb-4">
                <Text className="text-white font-bold text-xl">Jogadores</Text>
                <Text className="text-gray-400 text-sm">{participants.length} / {gameData.mode === 'double' ? 4 : 2} confirmados</Text>
            </View>

            {participants.length === 0 ? (
                <View className="bg-surface-dark p-6 rounded-2xl items-center border border-white/5 border-dashed">
                    <Text className="text-gray-500 text-center">Ainda ninguém confirmou.{'\n'}Seja o primeiro!</Text>
                </View>
            ) : (
                participants.map((p, index) => (
                    <View key={index} className="flex-row items-center mb-3 bg-surface-dark p-3 rounded-xl border border-white/5">
                         <Image source={{ uri: `https://api.dicebear.com/7.x/initials/png?seed=${p.profiles?.full_name || 'U'}` }} className="w-10 h-10 rounded-full border border-gray-600" />
                         <Text className="text-white ml-3 font-medium flex-1">{p.profiles?.full_name || 'Usuário'}</Text>
                         {p.user_id === gameData.host_id && (
                             <View className="bg-primary/20 px-2 py-1 rounded">
                                 <Text className="text-primary text-[10px] font-bold">HOST</Text>
                             </View>
                         )}
                    </View>
                ))
            )}
         </View>
      </ScrollView>

      {/* Footer Fixo */}
      <View className="absolute bottom-0 left-0 right-0 p-5 pt-10 bg-gradient-to-t from-background-dark via-background-dark to-transparent">
        {isHost ? (
            <TouchableOpacity 
                onPress={handleManage}
                className="w-full h-14 bg-surface-dark border border-white/20 rounded-full items-center justify-center active:bg-gray-800"
            >
                <Text className="text-white font-bold text-lg">Gerenciar Jogo</Text>
            </TouchableOpacity>
        ) : (
            <TouchableOpacity 
                onPress={isJoined ? handleLeave : handleJoin}
                disabled={loading}
                className={`w-full h-14 rounded-full items-center justify-center shadow-lg ${
                    isJoined ? 'bg-red-500/10 border border-red-500' : 'bg-primary'
                }`}
            >
                {loading ? (
                    <ActivityIndicator color={isJoined ? "red" : "black"} />
                ) : (
                    <View className="flex-row items-center gap-2">
                        <Text className={`font-bold text-lg ${isJoined ? 'text-red-500' : 'text-black'}`}>
                            {isJoined ? "Sair do Jogo" : "Confirmar Presença"}
                        </Text>
                        {!isJoined && <MaterialIcons name="check-circle" size={24} color="black" />}
                    </View>
                )}
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default GameDetailsScreen;
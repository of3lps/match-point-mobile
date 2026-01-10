import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const ReviewScreen = ({ route, navigation }) => {
  const { gameId } = route.params;
  const { user } = useAuth();
  
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para guardar as avaliações temporárias: { 'user_id_123': 5, 'user_id_456': 4 }
  const [ratings, setRatings] = useState({}); 
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchParticipantsToReview();
  }, []);

  const fetchParticipantsToReview = async () => {
    try {
      // Busca participantes do jogo
      const { data, error } = await supabase
        .from('game_participants')
        .select(`
          user_id,
          profiles (id, full_name, avatar_url)
        `)
        .eq('game_id', gameId);

      if (error) throw error;

      // Filtra para remover EU MESMO da lista (não posso me avaliar)
      const others = data.filter(p => p.user_id !== user.id);
      
      // Verifica se eu já avaliei alguém (para não mostrar de novo) - Opcional para V2
      
      setParticipants(others);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os jogadores.");
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (userId, stars) => {
    setRatings(prev => ({ ...prev, [userId]: stars }));
  };

  const handleComment = (userId, text) => {
    setComments(prev => ({ ...prev, [userId]: text }));
  };

  const submitReview = async (participantId) => {
    const stars = ratings[participantId];
    const comment = comments[participantId];

    if (!stars) {
        return Alert.alert("Ops", "Selecione quantas estrelas.");
    }

    try {
        const { error } = await supabase.from('reviews').insert({
            game_id: gameId,
            reviewer_id: user.id,
            reviewed_id: participantId,
            rating: stars,
            comment: comment
        });

        if (error) throw error;

        Alert.alert("Sucesso", "Avaliação enviada!");
        
        // Remove esse usuário da lista localmente
        setParticipants(prev => prev.filter(p => p.user_id !== participantId));

        if (participants.length <= 1) {
            navigation.goBack(); // Se acabaram as pessoas, volta
        }

    } catch (error) {
        Alert.alert("Erro", "Você já avaliou este jogador ou houve um erro.");
    }
  };

  if (loading) {
    return <View className="flex-1 bg-background-dark justify-center items-center"><ActivityIndicator color="#f9f506"/></View>;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-row items-center px-4 py-3 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center bg-surface-dark rounded-full">
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white font-bold text-lg mr-10">Avaliar Jogadores</Text>
      </View>

      <ScrollView className="p-5">
        <Text className="text-gray-400 text-center mb-6">
            O jogo acabou! Como foi jogar com essa galera?
        </Text>

        {participants.length === 0 ? (
            <View className="items-center mt-10">
                <MaterialIcons name="check-circle" size={64} color="#4ade80" />
                <Text className="text-white font-bold text-xl mt-4">Tudo avaliado!</Text>
            </View>
        ) : (
            participants.map((p) => (
                <View key={p.user_id} className="bg-surface-dark p-4 rounded-2xl mb-6 border border-white/5">
                    
                    {/* Cabeçalho do Card */}
                    <View className="flex-row items-center mb-4">
                        <Image 
                            source={{ uri: p.profiles?.avatar_url || `https://api.dicebear.com/7.x/initials/png?seed=${p.profiles?.full_name}` }} 
                            className="w-12 h-12 rounded-full bg-gray-600"
                        />
                        <Text className="text-white font-bold text-lg ml-3 flex-1">
                            {p.profiles?.full_name}
                        </Text>
                    </View>

                    {/* Estrelas */}
                    <View className="flex-row justify-center gap-2 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => handleRating(p.user_id, star)}>
                                <MaterialIcons 
                                    name="star" 
                                    size={32} 
                                    color={(ratings[p.user_id] || 0) >= star ? "#f9f506" : "#4b5563"} 
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Comentário */}
                    <TextInput 
                        placeholder="Comentário (opcional)..."
                        placeholderTextColor="#666"
                        value={comments[p.user_id] || ''}
                        onChangeText={(text) => handleComment(p.user_id, text)}
                        className="bg-black/20 text-white p-3 rounded-lg mb-4"
                    />

                    {/* Botão Enviar Individual */}
                    <TouchableOpacity 
                        onPress={() => submitReview(p.user_id)}
                        className="bg-primary/20 border border-primary h-10 rounded-lg items-center justify-center"
                    >
                        <Text className="text-primary font-bold">Enviar Avaliação</Text>
                    </TouchableOpacity>
                </View>
            ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewScreen;
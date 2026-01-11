import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const StatBox = ({ label, value }) => (
  <View className="flex-1 bg-surface-dark p-3 rounded-xl items-center border border-white/5">
    <Text className="text-primary text-xl font-display font-bold">{value}</Text>
    <Text className="text-gray-400 text-xs uppercase mt-1 font-bold tracking-wider">{label}</Text>
  </View>
);

const UserProfileScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Renderiza estrelas
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <MaterialIcons 
            key={i} 
            name={i <= Math.round(rating) ? "star" : "star-border"} 
            size={16} 
            color="#f9f506" 
        />
      );
    }
    return <View className="flex-row">{stars}</View>;
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    try {
        // 1. Busca perfil
        const { data: userData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) throw error;
        setProfile(userData);

        // 2. Busca reviews
        const { data: reviewsData, error: reviewsError } = await supabase
            .from('reviews')
            .select(`
                rating, 
                comment, 
                created_at, 
                reviewer:profiles!reviewer_id (full_name)
            `)
            .eq('reviewed_id', userId)
            .order('created_at', { ascending: false })
            .limit(10);

        if (reviewsError) throw reviewsError;
        if (reviewsData) setReviews(reviewsData);

    } catch (error) {
        console.log("Erro ao carregar usuário:", error);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
        <View className="flex-1 bg-background-dark justify-center items-center">
            <ActivityIndicator color="#f9f506" size="large"/>
        </View>
    );
  }

  // Formatações
  const formattedLevel = profile?.tennis_level ? profile.tennis_level.toUpperCase() : '-';
  const formattedHand = profile?.play_hand ? profile.play_hand.toUpperCase() : '-';
  
  const matches = profile?.matches || 0;
  const wins = profile?.wins || 0;
  const winRate = matches > 0 ? ((wins / matches) * 100).toFixed(0) + '%' : '-';
  
  // Nota formatada (ex: 5.0)
  const ratingValue = profile?.rating_average ? profile.rating_average.toFixed(1) : '5.0';

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header com Voltar */}
      <View className="px-4 pt-2">
        <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            className="w-10 h-10 bg-surface-dark rounded-full items-center justify-center border border-white/10"
        >
             <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-5 pt-4" showsVerticalScrollIndicator={false}>
        
        {/* Foto e Nome */}
        <View className="items-center mt-2 mb-8">
            <Image 
              source={{ uri: profile?.avatar_url || `https://api.dicebear.com/7.x/initials/png?seed=${profile?.full_name}` }} 
              className="w-28 h-28 rounded-full border-4 border-gray-700"
            />
          
            <Text className="text-white text-2xl font-display font-bold mt-4 text-center">
                {profile?.full_name}
            </Text> 
          
            {/* --- VISUAL DE AVALIAÇÃO ATUALIZADO --- */}
            <View className="flex-row items-center gap-2 mt-2 bg-surface-dark px-3 py-1.5 rounded-full border border-white/5">
                <Text className="text-white font-bold text-sm">{ratingValue}</Text>
                {renderStars(profile?.rating_average || 5)}
                <Text className="text-gray-400 text-xs font-bold ml-1">
                    ({profile?.rating_count || 0} avaliações)
                </Text>
            </View>
            {/* -------------------------------------- */}
          
            <View className="flex-row gap-2 mt-4">
                <View className="bg-white/10 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">{formattedLevel}</Text>
                </View>
                <View className="bg-white/10 px-3 py-1 rounded-full">
                    <Text className="text-white text-xs font-bold">{formattedHand}</Text>
                </View>
            </View>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3 mb-8">
           <StatBox value={matches} label="Jogos" />
           <StatBox value={wins} label="Vitórias" />
           <StatBox value={winRate} label="Win Rate" />
        </View>

        {/* Lista de Reviews */}
        <View className="mb-10">
            <Text className="text-white text-lg font-bold mb-4 ml-1">Avaliações Recebidas</Text>
            
            {reviews.length === 0 ? (
                <View className="bg-surface-dark p-6 rounded-xl border border-white/5 border-dashed items-center">
                    <Text className="text-gray-500 italic">Nenhuma avaliação recebida ainda.</Text>
                </View>
            ) : (
                reviews.map((rev, index) => (
                    <View key={index} className="bg-surface-dark p-4 rounded-xl border border-white/5 mb-3">
                        <View className="flex-row justify-between items-start mb-2">
                            <Text className="text-primary font-bold text-sm">
                                {rev.reviewer?.full_name || 'Usuário'}
                            </Text>
                            {renderStars(rev.rating)}
                        </View>
                        
                        {rev.comment ? (
                            <Text className="text-gray-300 text-sm italic">"{rev.comment}"</Text>
                        ) : (
                            <Text className="text-gray-600 text-xs italic">Sem comentário escrito</Text>
                        )}

                        <Text className="text-gray-600 text-[10px] mt-2 text-right">
                            {new Date(rev.created_at).toLocaleDateString('pt-BR')}
                        </Text>
                    </View>
                ))
            )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfileScreen;
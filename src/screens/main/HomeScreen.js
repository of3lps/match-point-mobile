import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, SafeAreaView, StatusBar, RefreshControl, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; 
import { supabase } from '../../lib/supabase'; 

const HomeScreen = ({ navigation }) => {
  const [games, setGames] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Função para buscar jogos no Supabase
  const fetchGames = async () => {
    try {
      // Busca os jogos e TRAZ OS DADOS DO HOST JUNTOS (JOIN)
      // O 'host:profiles!host_id' diz: "Traga dados da tabela profiles, usando a coluna host_id, e chame de 'host'"
      const { data, error } = await supabase
        .from('games')
        .select(`
            *,
            host:profiles!host_id (
                full_name,
                avatar_url
            )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // DEBUG: Verifique no seu terminal se aparece "host: { full_name: ... }"
      if (data.length > 0) {
        // console.log("Primeiro jogo carregado:", data[0]); 
      }

      setGames(data);
    } catch (error) {
      console.log("Erro ao buscar jogos:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGames();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchGames();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark pt-8">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="flex-row justify-between items-center px-5 mb-6">
        <View>
          <Text className="text-gray-400 font-body text-xs uppercase tracking-widest">Match Point</Text>
          <Text className="text-white text-3xl font-display font-bold">Jogos Disponíveis</Text>
        </View>
        <TouchableOpacity className="bg-surface-dark p-2 rounded-full border border-white/10">
           <MaterialIcons name="notifications-none" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Filtros (Visual Only) */}
      <View className="px-5 mb-4">
        <FlatList 
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['Todos', 'Iniciante', 'Competitivo', 'Hoje']}
          keyExtractor={item => item}
          renderItem={({item, index}) => (
            <TouchableOpacity className={`px-5 py-2 rounded-full mr-3 ${index === 0 ? 'bg-primary' : 'bg-surface-dark border border-white/10'}`}>
              <Text className={`font-bold text-sm ${index === 0 ? 'text-black' : 'text-white'}`}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Lista de Jogos Reais */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
           <ActivityIndicator size="large" color="#f9f506" />
        </View>
      ) : (
        <FlatList
          data={games}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#f9f506" />
          }
          ListEmptyComponent={() => (
            <View className="items-center justify-center mt-20">
               <MaterialIcons name="sports-tennis" size={64} color="#333" />
               <Text className="text-gray-500 mt-4 text-center">Nenhum jogo encontrado.{'\n'}Seja o primeiro a criar!</Text>
            </View>
          )}
          renderItem={({ item }) => {
            // Lógica de fallback: Se não tiver host (erro) ou não tiver foto, usa Dicebear
            const hostName = item.host?.full_name || 'Organizador';
            const hostAvatar = item.host?.avatar_url || `https://api.dicebear.com/7.x/initials/png?seed=${hostName}`;

            return (
                <TouchableOpacity 
                  className="bg-surface-dark mb-4 rounded-3xl overflow-hidden border border-white/5 shadow-lg active:scale-[0.98] transition-all"
                  onPress={() => navigation.navigate('GameDetails', { game: item })}
                >
                  <View className="relative h-32">
                     <Image 
                        source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1622163642998-1ea36b1ad565?q=80' }} 
                        className="w-full h-full"
                     />
                     <View className="absolute inset-0 bg-black/30" />
                     <View className="absolute top-3 right-3 bg-surface-dark/90 px-3 py-1 rounded-full flex-row items-center gap-1 backdrop-blur-md">
                        <MaterialIcons name="star" size={14} color="#f9f506" />
                        <Text className="text-white text-xs font-bold uppercase">{item.level}</Text>
                     </View>
                  </View>
                  
                  <View className="p-4">
                     <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1 mr-2">
                           <Text className="text-white text-lg font-bold font-display leading-tight">{item.title}</Text>
                           <View className="flex-row items-center mt-1">
                              <MaterialIcons name="location-on" size={14} color="#8c8b5f" />
                              <Text className="text-gray-400 text-xs ml-1 font-medium">{item.location}</Text>
                           </View>
                        </View>
                        <View className="bg-primary/20 px-3 py-2 rounded-xl items-center min-w-[60px]">
                           <Text className="text-primary font-bold text-xs uppercase">DATA</Text>
                           <Text className="text-white font-bold text-sm">{item.date.split(' - ')[0] || 'Data'}</Text>
                        </View>
                     </View>

                     <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-white/5">
                        <View className="flex-row items-center">
                           {/* AQUI ESTÁ A FOTO REAL DO HOST */}
                           <Image source={{ uri: hostAvatar }} className="w-6 h-6 rounded-full border border-surface-dark" />
                           <Text className="text-gray-400 text-xs ml-2">por <Text className="text-white font-bold">{hostName}</Text></Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                           <MaterialIcons name={item.mode === 'double' ? 'groups' : 'person'} size={16} color="#f9f506" />
                           <Text className="text-white text-xs font-bold">{item.mode === 'double' ? 'Duplas' : 'Simples'}</Text>
                        </View>
                     </View>
                  </View>
                </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeScreen;
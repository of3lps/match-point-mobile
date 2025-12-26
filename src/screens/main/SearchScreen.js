import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, SafeAreaView, ActivityIndicator, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';

const FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'iniciante', label: 'Iniciante' },
  { id: 'intermediario', label: 'Intermediário' },
  { id: 'avancado', label: 'Avançado' },
  { id: 'profissional', label: 'Pro' },
];

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Busca inicial ao carregar a tela
  useFocusEffect(
    useCallback(() => {
      fetchGames();
    }, [])
  );

  // Função que busca no Supabase
  const fetchGames = async (searchText = '', filter = 'all') => {
    setLoading(true);
    try {
      let dbQuery = supabase
        .from('games')
        .select('*')
        .order('date', { ascending: true }); // Jogos mais próximos primeiro

      // 1. Filtro de Texto (Busca no Título OU no Local)
      if (searchText.trim()) {
        // sintaxe 'ilike' faz busca case-insensitive (ignora maiúsculas)
        // O operador 'or' permite buscar em uma coluna OU na outra
        dbQuery = dbQuery.or(`title.ilike.%${searchText}%,location.ilike.%${searchText}%`);
      }

      // 2. Filtro de Nível
      if (filter !== 'all') {
        dbQuery = dbQuery.eq('level', filter);
      }

      const { data, error } = await dbQuery;

      if (error) throw error;
      setResults(data || []);

    } catch (error) {
      console.log("Erro na busca:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Efeito "Debounce": Só busca quando o usuário parar de digitar por 500ms
  // Isso economiza banco de dados e evita "piscadas" na tela
  useEffect(() => {
    if (searchTimeout) clearTimeout(searchTimeout);
    
    const timeout = setTimeout(() => {
      fetchGames(query, selectedFilter);
    }, 500);

    setSearchTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [query, selectedFilter]);

  const handleClear = () => {
    setQuery('');
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark pt-8">
      
      {/* Header e Barra de Busca */}
      <View className="px-5 mb-4">
        <Text className="text-white text-3xl font-display font-bold mb-4">Explorar</Text>
        
        <View className="flex-row items-center bg-surface-dark rounded-xl border border-white/10 px-4 py-3">
          <MaterialIcons name="search" size={24} color="#8c8b5f" />
          <TextInput 
             value={query}
             onChangeText={setQuery}
             placeholder="Buscar jogos, locais..."
             placeholderTextColor="#6b6b60"
             className="flex-1 text-white font-body text-base ml-2"
             autoCapitalize="none"
             returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleClear}>
               <MaterialIcons name="close" size={20} color="#6b6b60" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros Horizontais */}
      <View className="mb-6">
        <FlatList 
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          renderItem={({item}) => (
            <TouchableOpacity 
              onPress={() => setSelectedFilter(item.id)}
              className={`px-5 py-2 rounded-full mr-3 border ${
                selectedFilter === item.id 
                  ? 'bg-primary border-primary' 
                  : 'bg-surface-dark border-white/10'
              }`}
            >
              <Text className={`font-bold text-sm ${selectedFilter === item.id ? 'text-black' : 'text-white'}`}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Lista de Resultados */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
           <ActivityIndicator color="#f9f506" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
          ListEmptyComponent={() => (
            <View className="items-center justify-center mt-10 opacity-50">
               <MaterialIcons name="search-off" size={48} color="white" />
               <Text className="text-gray-400 mt-4 text-center font-body">
                 Nenhum jogo encontrado com esses filtros.
               </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity 
              className="flex-row bg-surface-dark mb-4 rounded-2xl overflow-hidden border border-white/5 active:bg-gray-800"
              onPress={() => navigation.navigate('GameDetails', { game: item })}
            >
              {/* Imagem Pequena (Esquerda) */}
              <Image 
                 source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1622163642998-1ea36b1ad565?q=80' }} 
                 className="w-24 h-full bg-gray-700"
              />
              
              {/* Conteúdo */}
              <View className="flex-1 p-3 justify-center">
                 <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-white font-bold text-base flex-1 mr-2 leading-5" numberOfLines={2}>
                        {item.title}
                    </Text>
                    <View className="bg-primary/20 px-2 py-1 rounded">
                       <Text className="text-primary text-[10px] font-bold uppercase">{item.level.slice(0,3)}</Text>
                    </View>
                 </View>

                 <View className="flex-row items-center mt-1">
                    <MaterialIcons name="location-on" size={14} color="#6b6b60" />
                    <Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>{item.location}</Text>
                 </View>

                 <View className="flex-row items-center justify-between mt-3 pt-2 border-t border-white/5">
                    <Text className="text-white text-xs font-bold">{item.date.split(' - ')[0]}</Text>
                    <View className="flex-row items-center gap-1">
                        <MaterialIcons name={item.mode === 'double' ? 'groups' : 'person'} size={14} color="#f9f506" />
                        <Text className="text-gray-400 text-[10px] uppercase">{item.mode === 'double' ? 'Duplas' : 'Simples'}</Text>
                    </View>
                 </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
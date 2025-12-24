import React from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="px-5 pt-4 pb-2">
        <Text className="text-white text-3xl font-display font-bold mb-4">Buscar</Text>
        
        {/* Barra de Pesquisa */}
        <View className="relative mb-4">
           <MaterialIcons name="search" size={24} color="#6b6b60" style={{ position: 'absolute', left: 16, top: 14, zIndex: 1 }} />
           <TextInput 
             placeholder="Buscar quadras, clubes ou parceiros"
             placeholderTextColor="#6b6b60"
             className="bg-surface-dark text-white rounded-xl py-3.5 pl-12 pr-4 font-body border border-gray-800 focus:border-primary"
           />
        </View>

        {/* Filtros Rápidos */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
           <TouchableOpacity className="bg-primary px-4 py-2 rounded-lg mr-2"><Text className="text-black font-bold text-xs">Próximos a mim</Text></TouchableOpacity>
           <TouchableOpacity className="bg-surface-dark border border-gray-700 px-4 py-2 rounded-lg mr-2"><Text className="text-white font-medium text-xs">Hoje</Text></TouchableOpacity>
           <TouchableOpacity className="bg-surface-dark border border-gray-700 px-4 py-2 rounded-lg mr-2"><Text className="text-white font-medium text-xs">Competitivo</Text></TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
         <Text className="text-gray-400 text-sm font-bold uppercase mb-3 mt-2">Resultados Recentes</Text>
         
         {/* Card de Resultado (Exemplo) */}
         <TouchableOpacity 
            onPress={() => navigation.navigate('GameDetails')}
            className="flex-row items-center bg-surface-dark p-3 rounded-xl mb-3 border border-gray-800"
         >
            <Image source={{ uri: 'https://images.unsplash.com/photo-1622163642998-1ea3130026e9?q=80' }} className="w-16 h-16 rounded-lg bg-gray-700 mr-3" />
            <View className="flex-1">
               <Text className="text-white font-bold text-base">Clube Pinheiros</Text>
               <Text className="text-gray-400 text-xs">2km • Saibro</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6b6b60" />
         </TouchableOpacity>

         <TouchableOpacity 
            onPress={() => navigation.navigate('GameDetails')}
            className="flex-row items-center bg-surface-dark p-3 rounded-xl mb-3 border border-gray-800"
         >
            <Image source={{ uri: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80' }} className="w-16 h-16 rounded-lg bg-gray-700 mr-3" />
            <View className="flex-1">
               <Text className="text-white font-bold text-base">Parque Villa Lobos</Text>
               <Text className="text-gray-400 text-xs">5km • Cimento</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#6b6b60" />
         </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
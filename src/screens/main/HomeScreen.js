import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Componente de Card Atualizado (Clicável)
const GameCard = ({ title, court, time, level, image, isPartner, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    activeOpacity={0.7} // Feedback visual ao tocar
    className="flex-row gap-4 bg-surface-dark p-4 rounded-2xl mb-4 border border-white/5 shadow-sm"
  >
    <View className="flex-1 justify-between gap-2">
      <View>
        <View className="flex-row items-center gap-2 mb-1">
          <View className={`w-2 h-2 rounded-full ${isPartner ? 'bg-primary' : 'bg-green-500'}`} />
          <Text className="text-text-light text-[10px] font-bold uppercase tracking-wider">
            {isPartner ? 'Clube Parceiro' : 'Partida Amistosa'}
          </Text>
        </View>
        <Text className="text-white text-lg font-display font-bold leading-tight">{title}</Text>
        <Text className="text-gray-300 text-sm mt-1 font-body">{court}</Text>
      </View>
      <View className="flex-row flex-wrap gap-2 mt-2">
        <View className="flex-row items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
           <MaterialIcons name="calendar-today" size={12} color="#8c8b5f" />
           <Text className="text-gray-300 text-xs font-medium">{time}</Text>
        </View>
        <View className="flex-row items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
           <MaterialIcons name="trending-up" size={12} color="#8c8b5f" />
           <Text className="text-gray-300 text-xs font-medium">{level}</Text>
        </View>
      </View>
    </View>
    <View className="justify-between items-end gap-2">
       <Image source={{ uri: image }} className="w-16 h-16 rounded-xl bg-gray-800" resizeMode="cover" />
       <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center border border-white/5">
          <MaterialIcons name="arrow-forward" size={20} color="white" />
       </View>
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView className="flex-1 bg-background-dark edges={['top']}">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 pt-4 pb-4">
          <View className="flex-row items-center gap-3">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200' }} 
              className="w-12 h-12 rounded-full border-2 border-primary/20"
            />
            <View>
              <Text className="text-white text-xl font-display font-bold">Olá, Rafael! 🎾</Text>
              <Text className="text-text-light text-sm font-medium">Bora jogar hoje?</Text>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-surface-dark rounded-full items-center justify-center border border-white/10">
            <MaterialIcons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* CTA Rápido (Criar Jogo) */}
        <View className="px-5 pb-6">
           <TouchableOpacity 
             onPress={() => navigation.navigate('CreateTab')}
             className="w-full flex-row items-center justify-between p-4 bg-primary rounded-2xl shadow-lg shadow-primary/10 active:opacity-90"
           >
              <View className="flex-row items-center gap-3">
                 <View className="bg-black/10 p-2 rounded-full">
                    <MaterialIcons name="add" size={24} color="black" />
                 </View>
                 <Text className="text-black text-lg font-display font-bold">Criar novo jogo</Text>
              </View>
              <MaterialIcons name="arrow-forward" size={24} color="black" />
           </TouchableOpacity>
        </View>

        {/* Filtros Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 mb-6 max-h-10">
          <TouchableOpacity className="bg-white px-5 h-9 rounded-full justify-center mr-2 border border-white">
             <Text className="text-black font-bold text-sm">Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-transparent border border-gray-700 px-5 h-9 rounded-full justify-center mr-2">
             <Text className="text-gray-300 font-medium text-sm">Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-transparent border border-gray-700 px-5 h-9 rounded-full justify-center mr-2">
             <Text className="text-gray-300 font-medium text-sm">Nível 3.5-4.0</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-transparent border border-gray-700 px-5 h-9 rounded-full justify-center mr-6">
             <Text className="text-gray-300 font-medium text-sm">Clubes</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Feed de Jogos */}
        <View className="px-5 pb-24">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-display font-bold">Jogos Próximos</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SearchTab')}>
               <Text className="text-primary text-sm font-bold">Ver todos</Text>
            </TouchableOpacity>
          </View>

          {/* Destaque (Leva para ClubDetails) */}
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('ClubDetails')}
            className="group relative flex-col gap-4 rounded-2xl bg-surface-dark p-4 mb-6 border-2 border-primary/20"
          >
             <View className="relative h-40 w-full rounded-xl overflow-hidden bg-gray-800">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1622163642998-1ea3130026e9?q=80&w=2670&auto=format&fit=crop' }} 
                  className="w-full h-full"
                  resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/20" />
                <View className="absolute top-3 left-3 bg-primary px-3 py-1 rounded-full flex-row items-center gap-1 shadow-sm">
                   <MaterialIcons name="stars" size={14} color="black" />
                   <Text className="text-black text-xs font-bold uppercase">Clube Parceiro</Text>
                </View>
                <View className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded-lg flex-row items-center gap-1 backdrop-blur-sm">
                   <MaterialIcons name="location-on" size={14} color="white" />
                   <Text className="text-white text-xs font-bold">Clube Pinheiros</Text>
                </View>
             </View>

             <View className="flex-row justify-between items-end">
               <View>
                 <View className="flex-row items-center gap-2 mb-1">
                    <MaterialIcons name="schedule" size={18} color="#f9f506" />
                    <Text className="text-white font-bold text-base">19:00 • Hoje</Text>
                 </View>
                 <View className="flex-row gap-2 mt-1">
                    <View className="bg-white/10 px-2 py-1 rounded text-xs">
                        <Text className="text-gray-300 text-xs font-medium">Intermediário</Text>
                    </View>
                    <View className="bg-white/10 px-2 py-1 rounded text-xs">
                        <Text className="text-gray-300 text-xs font-medium">2/4 Vagas</Text>
                    </View>
                 </View>
               </View>
               <View className="h-10 px-5 rounded-full bg-white items-center justify-center">
                  <Text className="text-black font-bold text-sm">Entrar</Text>
               </View>
             </View>
          </TouchableOpacity>

          {/* Lista de Jogos (Levam para GameDetails) */}
          <GameCard 
            title="Parque Ibirapuera" 
            court="Quadra 3 • Cimento" 
            time="Amanhã, 08:00" 
            level="Nível 4.0" 
            image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80"
            isPartner={false}
            onPress={() => navigation.navigate('GameDetails', { title: "Parque Ibirapuera", date: "Amanhã, 08:00" })}
          />
           <GameCard 
            title="Academia Play Tennis" 
            court="Quadra Coberta • Saibro" 
            time="Sáb, 10:00" 
            level="Iniciante" 
            image="https://images.unsplash.com/photo-1599474924187-334a405be2fa?q=80"
            isPartner={false}
            onPress={() => navigation.navigate('GameDetails', { title: "Academia Play Tennis", date: "Sáb, 10:00" })}
          />
           <GameCard 
            title="Condomínio Jardins" 
            court="Privado • Rápida" 
            time="Dom, 16:30" 
            level="Misto" 
            image="https://images.unsplash.com/photo-1627627448892-0466487e4475?q=80"
            isPartner={false}
            onPress={() => navigation.navigate('GameDetails', { title: "Condomínio Jardins", date: "Dom, 16:30" })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
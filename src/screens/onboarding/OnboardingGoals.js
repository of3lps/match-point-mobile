import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const GoalCard = ({ title, subtitle, icon, image, value, selected, onSelect }) => (
  <TouchableOpacity 
    onPress={() => onSelect(value)}
    className={`flex-row items-center justify-between p-4 rounded-xl mb-4 border-2 transition-all
      ${selected ? 'bg-surface-dark border-primary shadow-lg shadow-primary/10' : 'bg-surface-dark border-transparent'}
    `}
  >
    <View className="flex-1 pr-4">
       <View className="flex-row items-center gap-2 mb-1">
          <MaterialIcons name={icon} size={24} color="#f9f506" />
          <Text className="text-white text-lg font-bold">{title}</Text>
       </View>
       <Text className="text-gray-400 text-sm">{subtitle}</Text>
    </View>
    <Image source={{ uri: image }} className="w-20 h-20 rounded-lg" />
    
    {selected && (
       <View className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
          <MaterialIcons name="check" size={12} color="black" />
       </View>
    )}
  </TouchableOpacity>
);

export default function OnboardingGoals({ navigation }) {
  const [goal, setGoal] = useState('training');

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 px-6 pt-6">
        {/* Barra de Progresso */}
        <View className="flex-row items-center justify-start gap-2 mb-8">
            <View className="h-2 w-2 rounded-full bg-gray-700" />
            <View className="h-2 w-8 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-gray-700" />
        </View>

        <Text className="text-white text-3xl font-bold mb-2">Defina seu objetivo</Text>
        <Text className="text-gray-400 mb-8">O que você procura hoje?</Text>

        <View>
          <GoalCard 
             title="Jogo Casual"
             subtitle="Diversão sem compromisso."
             icon="sentiment-satisfied"
             image="https://images.unsplash.com/photo-1554068865-24131878f8ee?q=80"
             value="casual"
             selected={goal === 'casual'}
             onSelect={setGoal}
          />
           <GoalCard 
             title="Treino"
             subtitle="Melhore sua técnica."
             icon="fitness-center"
             image="https://images.unsplash.com/photo-1615118266406-fa119842c544?q=80"
             value="training"
             selected={goal === 'training'}
             onSelect={setGoal}
          />
           <GoalCard 
             title="Competitivo"
             subtitle="Valendo pontos e ranking."
             icon="emoji-events"
             image="https://images.unsplash.com/photo-1599586120429-48285b6a8a81?q=80"
             value="competitive"
             selected={goal === 'competitive'}
             onSelect={setGoal}
          />
        </View>

        <View className="mt-auto pb-8">
           <TouchableOpacity 
             onPress={() => navigation.navigate('OnboardingSchedule')}
             className="w-full h-14 bg-primary rounded-full flex-row items-center justify-center gap-2"
           >
             <Text className="text-black text-lg font-bold">Continuar</Text>
             <MaterialIcons name="arrow-forward" size={20} color="black" />
           </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
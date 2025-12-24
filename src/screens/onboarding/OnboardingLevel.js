import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const LevelCard = ({ title, description, image, value, selected, onSelect }) => (
  <TouchableOpacity 
    onPress={() => onSelect(value)}
    className={`flex-row items-center p-4 rounded-xl mb-4 border-2 transition-all
      ${selected ? 'bg-primary/10 border-primary' : 'bg-surface-dark border-transparent'}
    `}
  >
    <Image 
      source={{ uri: image }} 
      className="w-20 h-20 rounded-lg bg-gray-700 mr-4"
    />
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-white text-lg font-bold">{title}</Text>
        {selected && <MaterialIcons name="check-circle" size={24} color="#f9f506" />}
      </View>
      <Text className="text-gray-400 text-sm leading-snug">{description}</Text>
    </View>
  </TouchableOpacity>
);

export default function OnboardingLevel({ navigation }) {
  const [level, setLevel] = useState('intermediary');

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 px-6 pt-6">
        {/* Barra de Progresso */}
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-surface-dark items-center justify-center">
             <MaterialIcons name="arrow-back" size={20} color="white" />
          </TouchableOpacity>
          <View className="flex-row gap-2">
            <View className="h-2 w-8 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-gray-700" />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('OnboardingGoals')}>
             <Text className="text-gray-400 font-medium">Pular</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-white text-3xl font-bold mb-2">Qual é o seu nível?</Text>
        <Text className="text-gray-400 mb-8">Isso nos ajuda a encontrar parceiros ideais e jogos equilibrados.</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <LevelCard 
            title="Iniciante"
            description="Estou aprendendo as regras e golpes básicos."
            image="https://images.unsplash.com/photo-1622163642998-1ea3130026e9?q=80"
            value="beginner"
            selected={level === 'beginner'}
            onSelect={setLevel}
          />
          <LevelCard 
            title="Intermediário"
            description="Consigo manter ralis e sacar com consistência."
            image="https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80"
            value="intermediary"
            selected={level === 'intermediary'}
            onSelect={setLevel}
          />
          <LevelCard 
            title="Avançado"
            description="Jogo competições e tenho controle total do jogo."
            image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80"
            value="advanced"
            selected={level === 'advanced'}
            onSelect={setLevel}
          />
        </ScrollView>

        <View className="pb-8 pt-4">
           <TouchableOpacity 
             onPress={() => navigation.navigate('OnboardingGoals')}
             className="w-full h-14 bg-primary rounded-full flex-row items-center justify-center gap-2 shadow-lg shadow-primary/20"
           >
             <Text className="text-black text-lg font-bold">Continuar</Text>
             <MaterialIcons name="arrow-forward" size={20} color="black" />
           </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
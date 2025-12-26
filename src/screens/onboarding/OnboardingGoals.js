import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const GOALS = [
  { id: 'casual', label: 'Jogar Casual', icon: 'mood' },
  { id: 'competir', label: 'Competir / Rankings', icon: 'emoji-events' },
  { id: 'treinar', label: 'Treinar Fundamentos', icon: 'fitness-center' },
  { id: 'social', label: 'Fazer Amigos', icon: 'groups' },
];

const OnboardingGoals = ({ navigation }) => {
  const { user } = useAuth();
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleGoal = (id) => {
    if (selectedGoals.includes(id)) {
      setSelectedGoals(selectedGoals.filter(g => g !== id));
    } else {
      setSelectedGoals([...selectedGoals, id]);
    }
  };

  const handleContinue = async () => {
    if (selectedGoals.length === 0) return;
    setLoading(true);

    try {
      if (user) {
        // Salva o array de objetivos no Supabase
        const { error } = await supabase
          .from('profiles')
          .update({ goals: selectedGoals })
          .eq('id', user.id);

        if (error) throw error;
      }
      navigation.navigate('OnboardingSchedule');
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar seus objetivos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 px-6 pt-10">
        {/* Barra de Progresso (2/3) */}
        <View className="flex-row h-1 bg-gray-800 rounded-full mb-8">
           <View className="w-2/3 h-full bg-primary rounded-full" />
        </View>

        <Text className="text-white text-3xl font-display font-bold mb-2">O que você busca?</Text>
        <Text className="text-gray-400 font-body mb-8">Selecione quantos quiser.</Text>

        <View className="flex-row flex-wrap gap-4">
           {GOALS.map((goal) => {
             const isSelected = selectedGoals.includes(goal.id);
             return (
               <TouchableOpacity
                 key={goal.id}
                 onPress={() => toggleGoal(goal.id)}
                 className={`w-[47%] p-4 rounded-2xl border-2 h-32 justify-between ${
                   isSelected ? 'bg-primary border-primary' : 'bg-surface-dark border-transparent'
                 }`}
               >
                  <MaterialIcons name={goal.icon} size={28} color={isSelected ? 'black' : '#f9f506'} />
                  <Text className={`font-bold text-base ${isSelected ? 'text-black' : 'text-white'}`}>
                    {goal.label}
                  </Text>
                  {isSelected && (
                    <View className="absolute top-2 right-2">
                      <MaterialIcons name="check-circle" size={20} color="black" />
                    </View>
                  )}
               </TouchableOpacity>
             );
           })}
        </View>

        <View className="absolute bottom-10 left-6 right-6">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={selectedGoals.length === 0 || loading}
            className={`w-full h-14 rounded-full items-center justify-center shadow-lg ${
              selectedGoals.length > 0 ? 'bg-primary' : 'bg-gray-800'
            }`}
          >
            {loading ? <ActivityIndicator color="black" /> : (
               <Text className={`font-bold text-lg ${selectedGoals.length > 0 ? 'text-black' : 'text-gray-500'}`}>
                 Continuar
               </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingGoals;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const PERIODS = ['Manhã', 'Tarde', 'Noite'];
const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

const OnboardingSchedule = ({ navigation }) => {
  const { user } = useAuth();
  // Estado simples: quais dias/períodos estão marcados.
  // Ex: { 'Seg-Noite': true, 'Sáb-Manhã': true }
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);

  const toggleSlot = (day, period) => {
    const key = `${day}-${period}`;
    setAvailability(prev => {
      const newState = { ...prev };
      if (newState[key]) delete newState[key];
      else newState[key] = true;
      return newState;
    });
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      if (user) {
        // Salva a disponibilidade como JSON
        const { error } = await supabase
          .from('profiles')
          .update({ availability: availability })
          .eq('id', user.id);

        if (error) throw error;
      }
      
      // SUCESSO FINAL: Redireciona para a Home e limpa o histórico de navegação
      // O App.js já saberia fazer isso por estar logado, mas aqui forçamos a navegação
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });

    } catch (error) {
      Alert.alert("Erro", "Não foi possível finalizar seu cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView className="flex-1 px-4 pt-10 pb-24">
        {/* Barra de Progresso (3/3) */}
        <View className="flex-row h-1 bg-gray-800 rounded-full mb-8 mx-2">
           <View className="w-full h-full bg-primary rounded-full" />
        </View>

        <Text className="text-white text-3xl font-display font-bold mb-2 px-2">Disponibilidade</Text>
        <Text className="text-gray-400 font-body mb-6 px-2">Quando você costuma jogar?</Text>

        {/* Grade de Horários */}
        <View className="bg-surface-dark rounded-2xl p-4 border border-white/5">
          <View className="flex-row mb-4 border-b border-white/10 pb-2">
             <View className="w-12" /> 
             {PERIODS.map(p => (
               <Text key={p} className="flex-1 text-center text-gray-400 text-xs font-bold uppercase">{p}</Text>
             ))}
          </View>

          {WEEKDAYS.map((day) => (
            <View key={day} className="flex-row items-center mb-4 last:mb-0">
               <Text className="w-12 text-white font-bold">{day}</Text>
               {PERIODS.map((period) => {
                 const isSelected = availability[`${day}-${period}`];
                 return (
                   <TouchableOpacity 
                      key={period} 
                      onPress={() => toggleSlot(day, period)}
                      className="flex-1 items-center justify-center"
                   >
                      <View className={`w-8 h-8 rounded-full border items-center justify-center ${
                        isSelected ? 'bg-primary border-primary' : 'bg-transparent border-gray-700'
                      }`}>
                         {isSelected && <View className="w-3 h-3 bg-black rounded-full" />}
                      </View>
                   </TouchableOpacity>
                 );
               })}
            </View>
          ))}
        </View>

        <Text className="text-center text-gray-500 text-xs mt-6 px-4">
          Você poderá alterar isso depois no seu perfil.
        </Text>
      </ScrollView>

      {/* Footer */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent">
        <TouchableOpacity
          onPress={handleFinish}
          disabled={loading}
          className="w-full h-14 bg-primary rounded-full items-center justify-center shadow-lg"
        >
          {loading ? <ActivityIndicator color="black" /> : (
             <Text className="text-black font-bold text-lg">Finalizar Cadastro</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingSchedule;
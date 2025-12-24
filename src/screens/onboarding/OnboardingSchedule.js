import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const DayButton = ({ day, active, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`h-12 w-12 rounded-full items-center justify-center mr-2 relative
      ${active ? 'bg-primary' : 'bg-surface-dark border border-gray-700'}
    `}
  >
    <Text className={`text-xs font-bold uppercase ${active ? 'text-black' : 'text-gray-400'}`}>{day}</Text>
    {active && <View className="absolute bottom-1.5 h-1 w-1 rounded-full bg-black" />}
  </TouchableOpacity>
);

const TimeCard = ({ icon, title, time, active, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    className={`flex-row items-center justify-between p-4 rounded-xl mb-3 border-2
      ${active ? 'bg-surface-dark border-primary shadow-lg shadow-primary/10' : 'bg-surface-dark border-transparent'}
    `}
  >
    <View className="flex-row items-center gap-4">
       <View className={`w-12 h-12 rounded-full items-center justify-center ${active ? 'bg-primary' : 'bg-gray-800'}`}>
          <MaterialIcons name={icon} size={24} color={active ? 'black' : '#6b6b60'} />
       </View>
       <View>
          <Text className="text-white text-base font-bold">{title}</Text>
          <Text className="text-gray-400 text-sm">{time}</Text>
       </View>
    </View>
    {active && (
       <View className="w-6 h-6 rounded-full bg-primary items-center justify-center">
          <MaterialIcons name="check" size={16} color="black" />
       </View>
    )}
  </TouchableOpacity>
);

export default function OnboardingSchedule({ navigation }) {
  const [selectedDays, setSelectedDays] = useState(['M', 'W', 'F']);
  const [selectedTimes, setSelectedTimes] = useState(['afternoon', 'evening']);

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) setSelectedDays(selectedDays.filter(d => d !== day));
    else setSelectedDays([...selectedDays, day]);
  };

  const toggleTime = (time) => {
    if (selectedTimes.includes(time)) setSelectedTimes(selectedTimes.filter(t => t !== time));
    else setSelectedTimes([...selectedTimes, time]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 px-6 pt-6">
        {/* Barra de Progresso */}
        <View className="flex-row items-center justify-start gap-2 mb-8">
            <View className="h-2 w-2 rounded-full bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-gray-700" />
            <View className="h-2 w-8 rounded-full bg-primary" />
        </View>

        <Text className="text-white text-4xl font-bold mb-2">Sua Agenda</Text>
        <Text className="text-gray-400 mb-8">Selecione dias e horários que você costuma estar livre.</Text>

        <View className="mb-8">
           <View className="flex-row justify-between items-end mb-4">
              <Text className="text-white text-lg font-bold">Dias da semana</Text>
              <Text className="text-primary text-xs font-bold underline">Finais de Semana</Text>
           </View>
           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                 <DayButton 
                    key={i} 
                    day={day} 
                    active={selectedDays.includes(day)} 
                    onPress={() => toggleDay(day)}
                 />
              ))}
           </ScrollView>
        </View>

        <View>
           <Text className="text-white text-lg font-bold mb-4">Período do dia</Text>
           <TimeCard 
              icon="wb-twilight" title="Manhã" time="06:00 - 12:00" 
              active={selectedTimes.includes('morning')} 
              onPress={() => toggleTime('morning')}
           />
           <TimeCard 
              icon="wb-sunny" title="Tarde" time="12:00 - 18:00" 
              active={selectedTimes.includes('afternoon')} 
              onPress={() => toggleTime('afternoon')}
           />
           <TimeCard 
              icon="nights-stay" title="Noite" time="18:00 - 23:00" 
              active={selectedTimes.includes('evening')} 
              onPress={() => toggleTime('evening')}
           />
        </View>

        <View className="mt-auto pb-8">
           <TouchableOpacity 
             onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
             className="w-full h-14 bg-primary rounded-full flex-row items-center justify-center gap-2"
           >
             <Text className="text-black text-lg font-bold">Encontrar Jogos</Text>
             <MaterialIcons name="sports-tennis" size={20} color="black" />
           </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"; // <--- BIBLIOTECA NOVA

// Opções de Nível
const LEVELS = ['iniciante', 'intermediario', 'avancado', 'profissional'];

const CreateGameScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  // Estados do Formulário
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  
  // --- NOVOS ESTADOS DE DATA (OBJETOS DATE) ---
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  // --------------------------------------------

  const [level, setLevel] = useState('intermediario');
  const [mode, setMode] = useState('single'); 
  const [isParticipating, setIsParticipating] = useState(true);
  const [loading, setLoading] = useState(false);

  // --- HANDLERS DOS PICKERS ---
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirmDate = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);
  const handleConfirmTime = (selectedTime) => {
    setTime(selectedTime);
    hideTimePicker();
  };

  // Funções de formatação visual
  const formatDateVisual = (d) => d.toLocaleDateString('pt-BR');
  const formatTimeVisual = (d) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  const handleCreateGame = async () => {
    if (!title || !location) {
      return Alert.alert("Campos obrigatórios", "Por favor preencha o título e o local.");
    }

    setLoading(true);

    try {
      // 1. FORMATAR DATA PARA O BANCO (DD/MM/YYYY - HH:mm)
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');

      const finalDateString = `${day}/${month}/${year} - ${hours}:${minutes}`;

      // 2. Cria o Jogo
      const { data: newGame, error: gameError } = await supabase
        .from('games')
        .insert([
          {
            host_id: user.id,
            title,
            location,
            date: finalDateString, // Salva formatado
            level,
            mode,
            image_url: 'https://images.unsplash.com/photo-1622163642998-1ea36b1ad565?q=80',
          }
        ])
        .select() 
        .single();

      if (gameError) throw gameError;

      // 3. Se o host vai jogar
      if (isParticipating) {
         const { error: participantError } = await supabase
            .from('game_participants')
            .insert([
                { 
                  game_id: newGame.id, 
                  user_id: user.id,
                  status: 'confirmed'
                }
            ]);
         
         if (participantError) throw participantError;
      }

      Alert.alert("Sucesso", "Jogo criado com sucesso! 🎾");
      
      setTitle('');
      setLocation('');
      setDate(new Date()); // Reseta para hoje
      
      navigation.navigate('HomeTab');

    } catch (error) {
      Alert.alert("Erro ao criar", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <KeyboardAvoidingView 
         behavior={Platform.OS === "ios" ? "padding" : "height"}
         className="flex-1"
      >
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          
          <Text className="text-white text-3xl font-display font-bold mb-6">Criar Partida</Text>

          {/* Título */}
          <View className="mb-4">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Nome do Evento</Text>
             <TextInput 
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Treino de Sábado"
                placeholderTextColor="#666"
                className="bg-surface-dark text-white p-4 rounded-xl border border-white/10 font-bold text-lg"
             />
          </View>

          {/* Local */}
          <View className="mb-4">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Local (Clube/Quadra)</Text>
             <View className="flex-row items-center bg-surface-dark rounded-xl border border-white/10 px-4">
                <MaterialIcons name="location-on" size={20} color="#8c8b5f" />
                <TextInput 
                   value={location}
                   onChangeText={setLocation}
                   placeholder="Ex: Clube Pinheiros - Quadra 3"
                   placeholderTextColor="#666"
                   className="flex-1 text-white p-4 font-medium"
                />
             </View>
          </View>

          {/* --- DATA E HORA COM PICKERS --- */}
          <View className="flex-row gap-4 mb-6">
             
             {/* DATA */}
             <View className="flex-1">
                <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Data</Text>
                <TouchableOpacity 
                   onPress={showDatePicker}
                   className="bg-surface-dark border border-white/10 rounded-xl p-4 flex-row items-center justify-center active:bg-gray-800"
                >
                   <MaterialIcons name="calendar-today" size={20} color="#f9f506" />
                   <Text className="text-white font-bold ml-2">{formatDateVisual(date)}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                   isVisible={isDatePickerVisible}
                   mode="date"
                   onConfirm={handleConfirmDate}
                   onCancel={hideDatePicker}
                   minimumDate={new Date()}
                   locale="pt_BR"
                   confirmTextIOS="Confirmar"
                   cancelTextIOS="Cancelar"
                />
             </View>

             {/* HORA */}
             <View className="flex-1">
                <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Horário</Text>
                <TouchableOpacity 
                   onPress={showTimePicker}
                   className="bg-surface-dark border border-white/10 rounded-xl p-4 flex-row items-center justify-center active:bg-gray-800"
                >
                   <MaterialIcons name="schedule" size={20} color="#f9f506" />
                   <Text className="text-white font-bold ml-2">{formatTimeVisual(time)}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                   isVisible={isTimePickerVisible}
                   mode="time"
                   onConfirm={handleConfirmTime}
                   onCancel={hideTimePicker}
                   locale="pt_BR"
                   is24Hour
                   confirmTextIOS="Confirmar"
                   cancelTextIOS="Cancelar"
                />
             </View>
          </View>

          {/* Modo de Jogo */}
          <View className="mb-6">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-3">Modo de Jogo</Text>
             <View className="flex-row gap-4">
                <TouchableOpacity 
                   onPress={() => setMode('single')}
                   className={`flex-1 p-4 rounded-xl border items-center ${mode === 'single' ? 'bg-primary border-primary' : 'bg-surface-dark border-white/10'}`}
                >
                   <MaterialIcons name="person" size={24} color={mode === 'single' ? 'black' : 'gray'} />
                   <Text className={`font-bold mt-2 ${mode === 'single' ? 'text-black' : 'text-gray-400'}`}>Simples</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                   onPress={() => setMode('double')}
                   className={`flex-1 p-4 rounded-xl border items-center ${mode === 'double' ? 'bg-primary border-primary' : 'bg-surface-dark border-white/10'}`}
                >
                   <MaterialIcons name="groups" size={24} color={mode === 'double' ? 'black' : 'gray'} />
                   <Text className={`font-bold mt-2 ${mode === 'double' ? 'text-black' : 'text-gray-400'}`}>Duplas</Text>
                </TouchableOpacity>
             </View>
          </View>

          {/* OPÇÃO DE PARTICIPAÇÃO (MANTIDA) */}
          <View className="mb-6 bg-surface-dark p-4 rounded-xl border border-white/10 flex-row items-center justify-between">
              <View className="flex-1 mr-4">
                  <Text className="text-white font-bold text-base">Eu vou jogar</Text>
                  <Text className="text-gray-400 text-xs">Se desmarcar, você será apenas o organizador (Host).</Text>
              </View>
              <TouchableOpacity 
                  onPress={() => setIsParticipating(!isParticipating)}
                  className={`w-14 h-8 rounded-full justify-center px-1 ${isParticipating ? 'bg-primary' : 'bg-gray-600'}`}
              >
                  <View className={`w-6 h-6 bg-black rounded-full shadow-sm ${isParticipating ? 'self-end' : 'self-start'}`} />
              </TouchableOpacity>
          </View>

          {/* Nível */}
          <View className="mb-24">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-3">Nível Sugerido</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {LEVELS.map((lvl) => (
                   <TouchableOpacity
                      key={lvl}
                      onPress={() => setLevel(lvl)}
                      className={`px-6 py-3 rounded-full mr-3 border ${level === lvl ? 'bg-primary border-primary' : 'bg-transparent border-gray-600'}`}
                   >
                      <Text className={`font-bold uppercase text-xs ${level === lvl ? 'text-black' : 'text-gray-400'}`}>
                        {lvl}
                      </Text>
                   </TouchableOpacity>
                ))}
             </ScrollView>
          </View>

        </ScrollView>

        {/* Botão Final */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-background-dark/95 border-t border-white/5">
          <TouchableOpacity
            onPress={handleCreateGame}
            disabled={loading}
            className="w-full h-14 bg-primary rounded-full items-center justify-center shadow-lg"
          >
            {loading ? <ActivityIndicator color="black" /> : (
               <Text className="text-black font-bold text-lg">Criar Jogo</Text>
            )}
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateGameScreen;
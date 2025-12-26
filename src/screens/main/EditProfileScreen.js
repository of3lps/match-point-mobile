import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const LEVELS = [
  { id: 'iniciante', label: 'Iniciante (1.5 - 2.5)' },
  { id: 'intermediario', label: 'Intermediário (3.0 - 3.5)' },
  { id: 'avancado', label: 'Avançado (4.0 - 4.5)' },
  { id: 'profissional', label: 'Pro (5.0+)' },
];

const EditProfileScreen = ({ navigation }) => {
  const { user, profile } = useAuth(); // Pega dados atuais do contexto
  
  const [fullName, setFullName] = useState('');
  const [hand, setHand] = useState('');
  const [tennisLevel, setTennisLevel] = useState('');
  const [loading, setLoading] = useState(false);

  // Carrega os dados atuais quando a tela abre
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setHand(profile.play_hand || '');
      setTennisLevel(profile.tennis_level || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim()) return Alert.alert("Erro", "O nome não pode ficar vazio.");
    
    setLoading(true);
    try {
      // Atualiza no Supabase
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          play_hand: hand,
          tennis_level: tennisLevel,
          updated_at: new Date(),
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert("Sucesso", "Perfil atualizado!");
      navigation.goBack();
      
      // Dica: O AuthContext deve atualizar sozinho se estiver ouvindo mudanças, 
      // ou a próxima vez que carregar a tela de perfil.

    } catch (error) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center bg-surface-dark rounded-full">
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white font-bold text-lg mr-10">Editar Perfil</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          
          {/* Foto (Visual apenas por enquanto) */}
          <View className="items-center mb-8">
             <View className="w-24 h-24 rounded-full bg-surface-dark border-2 border-dashed border-gray-600 items-center justify-center mb-2">
                <MaterialIcons name="add-a-photo" size={32} color="gray" />
             </View>
             <Text className="text-primary text-xs font-bold">Alterar Foto (Em breve)</Text>
          </View>

          {/* Nome */}
          <View className="mb-6">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Nome Completo</Text>
             <TextInput 
                value={fullName}
                onChangeText={setFullName}
                className="bg-surface-dark text-white p-4 rounded-xl border border-white/10 font-bold text-base"
             />
          </View>

          {/* Mão Dominante */}
          <View className="mb-6">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-3">Mão Dominante</Text>
             <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => setHand('destro')}
                  className={`flex-1 py-3 rounded-xl border items-center ${hand === 'destro' ? 'bg-primary border-primary' : 'bg-surface-dark border-white/10'}`}
                >
                   <Text className={`font-bold ${hand === 'destro' ? 'text-black' : 'text-gray-400'}`}>Destro</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setHand('canhoto')}
                  className={`flex-1 py-3 rounded-xl border items-center ${hand === 'canhoto' ? 'bg-primary border-primary' : 'bg-surface-dark border-white/10'}`}
                >
                   <Text className={`font-bold ${hand === 'canhoto' ? 'text-black' : 'text-gray-400'}`}>Canhoto</Text>
                </TouchableOpacity>
             </View>
          </View>

          {/* Nível */}
          <View className="mb-20">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-3">Nível Técnico</Text>
             {LEVELS.map((lvl) => (
                <TouchableOpacity
                   key={lvl.id}
                   onPress={() => setTennisLevel(lvl.id)}
                   className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${
                     tennisLevel === lvl.id ? 'bg-primary/10 border-primary' : 'bg-surface-dark border-white/10'
                   }`}
                >
                   <Text className={`font-bold ${tennisLevel === lvl.id ? 'text-primary' : 'text-white'}`}>
                     {lvl.label}
                   </Text>
                   {tennisLevel === lvl.id && <MaterialIcons name="check-circle" size={20} color="#f9f506" />}
                </TouchableOpacity>
             ))}
          </View>

        </ScrollView>

        {/* Botão Salvar */}
        <View className="p-6 bg-background-dark border-t border-white/5">
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="w-full h-14 bg-primary rounded-full items-center justify-center shadow-lg"
          >
            {loading ? <ActivityIndicator color="black" /> : (
               <Text className="text-black font-bold text-lg">Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
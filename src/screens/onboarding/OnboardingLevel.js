import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';

const LEVELS = [
  { 
    id: 'iniciante', 
    label: 'Iniciante (1.5 - 2.5)', 
    desc: 'Estou começando a aprender os golpes básicos e regras.',
    icon: 'sports-tennis' 
  },
  { 
    id: 'intermediario', 
    label: 'Intermediário (3.0 - 3.5)', 
    desc: 'Consigo manter trocas de bola e conheço bem as regras.',
    icon: 'trending-up' 
  },
  { 
    id: 'avancado', 
    label: 'Avançado (4.0 - 4.5)', 
    desc: 'Tenho golpes consistentes, controle de spin e estratégia.',
    icon: 'star' 
  },
  { 
    id: 'profissional', 
    label: 'Competitivo / Pro (5.0+)', 
    desc: 'Jogo torneios regularmente e tenho alto desempenho.',
    icon: 'emoji-events' 
  },
];

const OnboardingLevel = ({ navigation }) => {
  const { user } = useAuth();
  
  // Estados
  const [name, setName] = useState('');
  const [hand, setHand] = useState(null); 
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    // 1. Validação
    if (!name.trim()) return Alert.alert("Atenção", "Por favor, digite seu nome.");
    if (!hand) return Alert.alert("Atenção", "Selecione sua mão dominante.");
    if (!selectedLevel) return Alert.alert("Atenção", "Selecione seu nível aproximado.");
    
    setLoading(true);

    try {
      if (user) {
        // 2. MUDANÇA AQUI: Usamos upsert em vez de update
        // O upsert precisa do ID dentro do objeto para saber quem é
        const { error } = await supabase
          .from('profiles')
          .upsert({ 
            id: user.id, // <--- IMPORTANTE: O ID deve ir aqui no upsert
            email: user.email, // Garantimos que o email vai também
            full_name: name,
            play_hand: hand,
            tennis_level: selectedLevel,
            updated_at: new Date(),
          });

        if (error) throw error;
      }

      navigation.navigate('OnboardingGoals');
      
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao salvar", "Não foi possível atualizar seu perfil.\n" + error.message);
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
          
          {/* Barra de Progresso (1/3) */}
          <View className="flex-row h-1 bg-gray-800 rounded-full mb-8">
             <View className="w-1/3 h-full bg-primary rounded-full" />
          </View>

          <Text className="text-white text-3xl font-display font-bold mb-6">Perfil do Jogador</Text>

          {/* --- SEÇÃO 1: NOME --- */}
          <View className="mb-8">
             <Text className="text-white font-bold mb-3 text-base">Como você quer ser chamado?</Text>
             <View className="bg-surface-dark rounded-xl border border-white/10 px-4 py-3 flex-row items-center">
                <MaterialIcons name="person" size={20} color="#6b6b60" style={{ marginRight: 10 }} />
                <TextInput 
                   placeholder="Seu nome completo"
                   placeholderTextColor="#6b6b60"
                   value={name}
                   onChangeText={setName}
                   className="flex-1 text-white font-body text-base"
                />
             </View>
          </View>

          {/* --- SEÇÃO 2: MÃO DOMINANTE --- */}
          <View className="mb-8">
             <Text className="text-white font-bold mb-3 text-base">Mão Dominante</Text>
             <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => setHand('destro')}
                  className={`flex-1 py-4 rounded-xl border items-center justify-center ${hand === 'destro' ? 'bg-primary border-primary' : 'bg-surface-dark border-white/10'}`}
                >
                   <MaterialIcons name="pan-tool" size={24} color={hand === 'destro' ? 'black' : 'gray'} />
                   <Text className={`font-bold mt-2 ${hand === 'destro' ? 'text-black' : 'text-gray-400'}`}>Destro</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => setHand('canhoto')}
                  className={`flex-1 py-4 rounded-xl border items-center justify-center ${hand === 'canhoto' ? 'bg-primary border-primary' : 'bg-surface-dark border-white/10'}`}
                >
                   <MaterialIcons name="pan-tool" size={24} color={hand === 'canhoto' ? 'black' : 'gray'} style={{ transform: [{ scaleX: -1 }] }} />
                   <Text className={`font-bold mt-2 ${hand === 'canhoto' ? 'text-black' : 'text-gray-400'}`}>Canhoto</Text>
                </TouchableOpacity>
             </View>
          </View>

          {/* --- SEÇÃO 3: NÍVEL --- */}
          <View className="mb-24">
            <Text className="text-white font-bold mb-3 text-base">Nível Técnico</Text>
            <View className="gap-3">
              {LEVELS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelectedLevel(item.id)}
                  activeOpacity={0.8}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    selectedLevel === item.id 
                      ? 'bg-primary border-primary' 
                      : 'bg-surface-dark border-transparent'
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-1">
                     <View className="flex-row items-center gap-3">
                        <MaterialIcons 
                          name={item.icon} 
                          size={24} 
                          color={selectedLevel === item.id ? 'black' : '#8c8b5f'} 
                        />
                        <Text className={`font-bold text-base ${
                          selectedLevel === item.id ? 'text-black' : 'text-white'
                        }`}>
                          {item.label}
                        </Text>
                     </View>
                     {selectedLevel === item.id && (
                       <MaterialIcons name="check-circle" size={20} color="black" />
                     )}
                  </View>
                  <Text className={`text-xs ${
                     selectedLevel === item.id ? 'text-black/80 font-medium' : 'text-gray-400'
                  }`}>
                    {item.desc}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* --- FOOTER FLUTUANTE --- */}
        <View className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-dark via-background-dark to-transparent">
          <TouchableOpacity
            onPress={handleContinue}
            disabled={loading}
            className={`w-full h-14 rounded-full items-center justify-center shadow-lg ${
              (name && hand && selectedLevel) ? 'bg-primary' : 'bg-gray-700'
            }`}
          >
            {loading ? (
              <ActivityIndicator color="black" />
            ) : (
              <Text className={`font-bold text-lg ${
                 (name && hand && selectedLevel) ? 'text-black' : 'text-gray-500'
              }`}>
                Continuar
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OnboardingLevel;
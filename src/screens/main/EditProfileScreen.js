import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import * as ImagePicker from 'expo-image-picker';

const LEVELS = [
  { id: 'iniciante', label: 'Iniciante (1.5 - 2.5)' },
  { id: 'intermediario', label: 'Intermediário (3.0 - 3.5)' },
  { id: 'avancado', label: 'Avançado (4.0 - 4.5)' },
  { id: 'profissional', label: 'Pro (5.0+)' },
];

const EditProfileScreen = ({ navigation }) => {
  const { user, profile } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [hand, setHand] = useState('');
  const [tennisLevel, setTennisLevel] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setHand(profile.play_hand || '');
      setTennisLevel(profile.tennis_level || '');
      setAvatarUrl(profile.avatar_url);
    }
  }, [profile]);

  // --- FUNÇÃO CORRIGIDA (VOLTANDO PARA O MODO SEGURO) ---
  const pickImage = async () => {
    try {
      // 1. Solicita permissão
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permissão necessária", "É necessário permitir o acesso à galeria nas configurações do seu celular.");
        return;
      }

      // 2. Abre a galeria
      // IMPORTANTE: Voltamos para 'MediaTypeOptions' para evitar o erro vermelho.
      // Se aparecer um aviso amarelo no terminal, pode ignorar por enquanto.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, 
        allowsEditing: false, 
        quality: 0.7,
      });

      // 3. Verifica se escolheu algo
      if (!result.canceled) {
        uploadImage(result.assets[0].uri);
      }
      
    } catch (error) {
      Alert.alert("Erro ao abrir galeria", error.message);
    }
  };

  // --- UPLOAD PARA O SUPABASE ---
  const uploadImage = async (uri) => {
    try {
      setUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      
      const fileExt = uri.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setAvatarUrl(data.publicUrl);

    } catch (error) {
      Alert.alert("Erro no Upload", "Não foi possível enviar a imagem: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) return Alert.alert("Erro", "O nome não pode ficar vazio.");
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          play_hand: hand,
          tennis_level: tennisLevel,
          avatar_url: avatarUrl,
          updated_at: new Date(),
        })
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert("Sucesso", "Perfil atualizado!");
      navigation.goBack();
      
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
          
          {/* Seção de Foto */}
          <View className="items-center mb-8">
             <TouchableOpacity 
               onPress={pickImage} 
               disabled={uploading}
               className="relative"
             >
                <Image 
                  source={{ uri: avatarUrl || `https://api.dicebear.com/7.x/initials/png?seed=${fullName}` }} 
                  className="w-28 h-28 rounded-full border-4 border-surface-dark bg-gray-700"
                />
                
                <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-background-dark">
                   {uploading ? (
                     <ActivityIndicator size="small" color="black" />
                   ) : (
                     <MaterialIcons name="camera-alt" size={20} color="black" />
                   )}
                </View>
             </TouchableOpacity>
             <Text className="text-gray-500 text-xs mt-3 font-medium">Toque para alterar a foto</Text>
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
            disabled={loading || uploading}
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
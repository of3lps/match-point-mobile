import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer'; // <--- BIBLIOTECA NOVA IMPORTADA AQUI

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

  // --- 1. SELEÇÃO DE IMAGEM ---
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert("Permissão negada", "Você precisa permitir o acesso à galeria.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true, // <--- O PULO DO GATO: Pedimos a string Base64
      });

      if (!result.canceled) {
        // Passamos o objeto asset inteiro, pois precisamos do base64 e da uri
        uploadImage(result.assets[0]);
      }
      
    } catch (error) {
      Alert.alert("Erro na Galeria", error.message);
    }
  };

  // --- 2. UPLOAD VIA ARRAYBUFFER (CORREÇÃO DOS 0 BYTES) ---
  const uploadImage = async (imageAsset) => {
    try {
      setUploading(true);

      // Se por acaso o base64 vier nulo (raro), paramos aqui
      if (!imageAsset.base64) {
        throw new Error("Falha ao processar imagem (base64 ausente).");
      }

      const fileExt = imageAsset.uri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // AQUI ESTÁ A CORREÇÃO:
      // Convertemos o texto base64 para ArrayBuffer (binário puro)
      const arrayBuffer = decode(imageAsset.base64);

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType: imageAsset.mimeType || 'image/jpeg', // Importante avisar o tipo
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      // Adicionamos timestamp para quebrar o cache
      setAvatarUrl(`${data.publicUrl}?t=${Date.now()}`);

    } catch (error) {
      Alert.alert("Erro no Upload", error.message);
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) return Alert.alert("Erro", "Nome obrigatório");
    
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
      Alert.alert("Erro ao Salvar", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-row items-center px-4 py-3 border-b border-white/5">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center bg-surface-dark rounded-full">
          <MaterialIcons name="close" size={24} color="white" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-white font-bold text-lg mr-10">Editar Perfil</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          
          <View className="items-center mb-8">
             <TouchableOpacity onPress={pickImage} disabled={uploading}>
                <Image 
                  source={{ uri: avatarUrl || `https://api.dicebear.com/7.x/initials/png?seed=${fullName}` }} 
                  className="w-32 h-32 rounded-full border-4 border-surface-dark bg-gray-700"
                />
                <View className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-background-dark">
                   {uploading ? <ActivityIndicator size="small" color="black" /> : <MaterialIcons name="camera-alt" size={20} color="black" />}
                </View>
             </TouchableOpacity>
             <Text className="text-gray-500 text-xs mt-3 font-medium">Toque para alterar a foto</Text>
          </View>

          <View className="mb-6">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-2">Nome</Text>
             <TextInput 
                value={fullName}
                onChangeText={setFullName}
                className="bg-surface-dark text-white p-4 rounded-xl border border-white/10 font-bold text-base"
             />
          </View>

          <View className="mb-6">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-3">Mão Dominante</Text>
             <View className="flex-row gap-4">
                <TouchableOpacity onPress={() => setHand('destro')} className={`flex-1 py-3 rounded-xl border items-center ${hand === 'destro' ? 'bg-primary border-primary' : 'bg-surface-dark border-white/10'}`}>
                   <Text className={`font-bold ${hand === 'destro' ? 'text-black' : 'text-gray-400'}`}>Destro</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setHand('canhoto')} className={`flex-1 py-3 rounded-xl border items-center ${hand === 'canhoto' ? 'bg-primary border-primary' : 'bg-surface-dark border-white/10'}`}>
                   <Text className={`font-bold ${hand === 'canhoto' ? 'text-black' : 'text-gray-400'}`}>Canhoto</Text>
                </TouchableOpacity>
             </View>
          </View>

          <View className="mb-20">
             <Text className="text-gray-400 text-xs uppercase font-bold mb-3">Nível</Text>
             {LEVELS.map((lvl) => (
                <TouchableOpacity key={lvl.id} onPress={() => setTennisLevel(lvl.id)} className={`flex-row items-center justify-between p-4 mb-3 rounded-xl border ${tennisLevel === lvl.id ? 'bg-primary/10 border-primary' : 'bg-surface-dark border-white/10'}`}>
                   <Text className={`font-bold ${tennisLevel === lvl.id ? 'text-primary' : 'text-white'}`}>{lvl.label}</Text>
                   {tennisLevel === lvl.id && <MaterialIcons name="check-circle" size={20} color="#f9f506" />}
                </TouchableOpacity>
             ))}
          </View>

        </ScrollView>

        <View className="p-6 bg-background-dark border-t border-white/5">
          <TouchableOpacity onPress={handleSave} disabled={loading || uploading} className="w-full h-14 bg-primary rounded-full items-center justify-center shadow-lg">
            {loading ? <ActivityIndicator color="black" /> : <Text className="text-black font-bold text-lg">Salvar Alterações</Text>}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
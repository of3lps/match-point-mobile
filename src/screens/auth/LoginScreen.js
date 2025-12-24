import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
  return (
    <View className="flex-1 bg-background-dark">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Imagem de Topo com Overlay */}
      <View className="h-[45vh] w-full rounded-b-[3rem] overflow-hidden relative">
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1614959543594-c249495392e9?q=80&w=2500&auto=format&fit=crop" }} 
          className="w-full h-full justify-end"
          resizeMode="cover"
        >
          {/* Gradiente Escuro (Simulado) */}
          <View className="absolute inset-0 bg-black/40" />
          <View className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
          
          {/* Badge Flutuante */}
          <View className="absolute bottom-8 w-full flex-row justify-center">
            <View className="bg-primary px-4 py-2 rounded-full flex-row items-center gap-2 shadow-lg animate-bounce">
              <MaterialIcons name="sports-tennis" size={20} color="#181811" />
              <Text className="text-text-main font-display font-bold uppercase text-sm tracking-wide">Match Point</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Corpo do Conteúdo */}
      <View className="flex-1 px-6 pt-8 pb-6 justify-between">
        <View className="items-center">
          <Text className="text-white text-4xl font-display font-bold text-center leading-tight mb-3">
            Encontre seu{"\n"}
            <Text className="text-transparent text-primary">próximo jogo</Text>
          </Text>
          <Text className="text-text-muted text-center text-base font-body px-4 leading-relaxed">
            Conecte-se com jogadores locais, reserve quadras e marque jogos reais em minutos.
          </Text>
        </View>

        {/* Formulário / Ações */}
        <View className="w-full gap-4">
          <View className="relative">
             <View className="absolute left-4 top-4 z-10">
               <MaterialIcons name="mail" size={24} color="#6b6b60" />
             </View>
             <TextInput 
                placeholder="Seu e-mail"
                placeholderTextColor="#6b6b60"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full bg-surface-dark text-white font-body rounded-full py-4 pl-12 pr-4 border border-gray-800 focus:border-primary focus:bg-surface-light/5 transition-all"
             />
          </View>

          <TouchableOpacity 
            className="w-full bg-primary h-14 rounded-full flex-row items-center justify-center shadow-lg shadow-primary/20 active:scale-[0.98]"
            onPress={() => navigation.navigate('OnboardingLevel')}
          >
            <Text className="text-black text-lg font-display font-bold mr-2">Continuar</Text>
            <MaterialIcons name="arrow-forward" size={20} color="black" />
          </TouchableOpacity>
          
          {/* Divisor Social */}
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-[1px] bg-gray-800" />
            <Text className="mx-4 text-text-muted text-xs font-bold uppercase">ou entre com</Text>
            <View className="flex-1 h-[1px] bg-gray-800" />
          </View>

          <View className="flex-row gap-3">
             <TouchableOpacity className="flex-1 bg-surface-dark border border-gray-800 h-12 rounded-full items-center justify-center flex-row gap-2">
                <MaterialIcons name="apple" size={20} color="white" />
                <Text className="text-white font-medium">Apple</Text>
             </TouchableOpacity>
             <TouchableOpacity className="flex-1 bg-surface-dark border border-gray-800 h-12 rounded-full items-center justify-center flex-row gap-2">
                 {/* Google Icon Simulado */}
                 <View className="w-5 h-5 bg-white rounded-full items-center justify-center">
                    <Text className="text-black font-bold text-xs">G</Text>
                 </View>
                <Text className="text-white font-medium">Google</Text>
             </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-4">
           <Text className="text-text-muted text-sm font-body">
             Não tem uma conta? <Text className="text-primary font-bold">Cadastre-se</Text>
           </Text>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
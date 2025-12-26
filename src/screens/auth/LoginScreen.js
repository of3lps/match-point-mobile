import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StatusBar, Alert, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../lib/AuthContext';

// Habilita animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoginScreen = ({ navigation }) => {
  const { signIn, signUp } = useAuth();
  
  // ESTADO DO MODO: Login vs Cadastro
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Alterna entre os modos com animação
  const toggleMode = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSignUp(!isSignUp);
    // Opcional: Limpar senha ao trocar
    // setPassword(''); 
  };

  const handleAuthAction = async () => {
    if (!email || !password) return Alert.alert("Atenção", "Preencha e-mail e senha.");
    
    setLoading(true);
    try {
      if (isSignUp) {
        // --- MODO CADASTRO ---
        await signUp(email, password);
        Alert.alert(
          "Verifique seu E-mail", 
          `Enviamos um link para ${email}.\nConfirme sua conta antes de entrar.`
        );
        setIsSignUp(false); // Volta para login após sucesso
      } else {
        // --- MODO LOGIN ---
        await signIn(email, password);
        // Sucesso = Redirecionamento automático pelo App.js
      }
    } catch (error) {
       // Tratamento de erro específico do Supabase
       if (error.message.includes("Email not confirmed")) {
          Alert.alert("E-mail pendente", "Você precisa confirmar seu e-mail antes de entrar.");
       } else {
          Alert.alert("Erro", error.message);
       }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background-dark">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Imagem de Topo */}
      <View className="h-[45vh] w-full rounded-b-[3rem] overflow-hidden relative">
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1614959543594-c249495392e9?q=80&w=2500&auto=format&fit=crop" }} 
          className="w-full h-full justify-end"
          resizeMode="cover"
        >
          <View className="absolute inset-0 bg-black/40" />
          <View className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent" />
        </ImageBackground>
      </View>

      {/* Conteúdo Principal */}
      <View className="flex-1 px-6 pt-6 pb-6 justify-between">
        
        {/* Títulos Dinâmicos */}
        <View className="items-center">
          <Text className="text-white text-3xl font-display font-bold text-center leading-tight mb-2">
            {isSignUp ? "Crie sua conta" : "Bem-vindo de volta!"}
          </Text>
          <Text className="text-text-muted text-center text-sm font-body px-8">
            {isSignUp 
              ? "Junte-se à comunidade e encontre seu parceiro de tênis ideal."
              : "Conecte-se para marcar jogos e acompanhar seu progresso."}
          </Text>
        </View>

        {/* Formulário */}
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
                value={email}
                onChangeText={setEmail}
                className="w-full bg-surface-dark text-white font-body rounded-full py-4 pl-12 pr-4 border border-gray-800 focus:border-primary transition-all"
             />
          </View>

          <View className="relative">
             <View className="absolute left-4 top-4 z-10">
               <MaterialIcons name="lock" size={24} color="#6b6b60" />
             </View>
             <TextInput 
                placeholder="Sua senha"
                placeholderTextColor="#6b6b60"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                className="w-full bg-surface-dark text-white font-body rounded-full py-4 pl-12 pr-4 border border-gray-800 focus:border-primary transition-all"
             />
          </View>

          {/* Botão de Ação Dinâmico */}
          <TouchableOpacity 
            className={`w-full h-14 rounded-full flex-row items-center justify-center shadow-lg active:scale-[0.98] 
              ${loading ? 'bg-gray-600' : (isSignUp ? 'bg-white' : 'bg-primary')}`}
            onPress={handleAuthAction}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={isSignUp ? "black" : "black"} />
            ) : (
              <>
                <Text className="text-black text-lg font-display font-bold mr-2">
                  {isSignUp ? "Cadastrar" : "Entrar"}
                </Text>
                <MaterialIcons name={isSignUp ? "person-add" : "login"} size={20} color="black" />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Rodapé: Botão de Troca (Toggle) */}
        <View className="items-center mt-4">
           <TouchableOpacity onPress={toggleMode} disabled={loading} className="p-2">
             <Text className="text-text-muted text-sm font-body">
               {isSignUp ? "Já tem uma conta? " : "Não tem uma conta? "}
               <Text className={isSignUp ? "text-white font-bold" : "text-primary font-bold"}>
                 {isSignUp ? "Fazer Login" : "Cadastre-se"}
               </Text>
             </Text>
           </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

export default LoginScreen;
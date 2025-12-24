import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';

// Carregamento de Fontes
import { useFonts, SplineSans_700Bold, SplineSans_400Regular, SplineSans_600SemiBold } from '@expo-google-fonts/spline-sans';
import { NotoSans_400Regular, NotoSans_700Bold, NotoSans_500Medium } from '@expo-google-fonts/noto-sans';

// --- IMPORTAÇÃO DAS TELAS ---

// Auth
import LoginScreen from './src/screens/auth/LoginScreen';

// Onboarding
import OnboardingLevel from './src/screens/onboarding/OnboardingLevel';
import OnboardingGoals from './src/screens/onboarding/OnboardingGoals';
import OnboardingSchedule from './src/screens/onboarding/OnboardingSchedule';

// Main (Abas)
import HomeScreen from './src/screens/main/HomeScreen';
import CreateGameScreen from './src/screens/main/CreateGameScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';

// Booking
import ClubDetailsScreen from './src/screens/booking/ClubDetailsScreen';

// Inicialização dos Navegadores
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- CONFIGURAÇÃO DAS ABAS (BOTTOM TABS) ---
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#2c2b15', // surface-dark
          borderTopColor: '#3d3d20',
          height: 80, // Mais alto para acomodar o botão central
          paddingBottom: 20,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0
        },
        tabBarActiveTintColor: '#f9f506', // primary
        tabBarInactiveTintColor: '#6b6b60', // text-muted
        tabBarLabelStyle: {
          fontFamily: 'SplineSans_600SemiBold',
          fontSize: 10,
        }
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} />
        }}
      />
      
      {/* Placeholder para Busca - Usando Home por enquanto */}
      <Tab.Screen 
        name="SearchTab" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color }) => <MaterialIcons name="search" size={28} color={color} />
        }}
      />

      {/* Botão de destaque "Criar Jogo" */}
      <Tab.Screen 
        name="CreateTab" 
        component={CreateGameScreen} 
        options={{
          tabBarLabel: () => null, // Sem texto
          tabBarIcon: () => (
            <View className="bg-white h-16 w-16 rounded-full justify-center items-center -mt-10 shadow-lg border-4 border-background-dark">
               <MaterialIcons name="sports-tennis" size={32} color="#000" />
            </View>
          ),
        }}
      />

      {/* Placeholder para Mensagens - Usando Home por enquanto */}
      <Tab.Screen 
        name="MessagesTab" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Msgs',
          tabBarIcon: ({ color }) => <MaterialIcons name="chat-bubble" size={26} color={color} />
        }}
      />

      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={28} color={color} />
        }}
      />
    </Tab.Navigator>
  );
}

// --- APP PRINCIPAL ---
export default function App() {
  // Carregar Fontes antes de renderizar
  let [fontsLoaded] = useFonts({
    SplineSans_700Bold,
    SplineSans_600SemiBold,
    SplineSans_400Regular,
    NotoSans_700Bold,
    NotoSans_500Medium,
    NotoSans_400Regular,
  });

  // Tela de Loading enquanto as fontes não carregam
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#23220f', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f9f506" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#23220f" translucent={false} />
      
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ 
          headerShown: false,
          animation: 'slide_from_right' // Animação suave entre telas
        }}
      >
        {/* 1. Fluxo de Entrada */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* 2. Fluxo de Onboarding */}
        <Stack.Screen name="OnboardingLevel" component={OnboardingLevel} />
        <Stack.Screen name="OnboardingGoals" component={OnboardingGoals} />
        <Stack.Screen name="OnboardingSchedule" component={OnboardingSchedule} />

        {/* 3. Aplicação Principal (Abas) */}
        <Stack.Screen name="Main" component={MainTabs} />

        {/* 4. Telas Internas (sem abas) */}
        <Stack.Screen name="ClubDetails" component={ClubDetailsScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
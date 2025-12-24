import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts, SplineSans_700Bold, SplineSans_600SemiBold, SplineSans_400Regular } from '@expo-google-fonts/spline-sans';
import { NotoSans_400Regular, NotoSans_700Bold, NotoSans_500Medium } from '@expo-google-fonts/noto-sans';

// Auth
import LoginScreen from './src/screens/auth/LoginScreen';

// Onboarding
import OnboardingLevel from './src/screens/onboarding/OnboardingLevel';
import OnboardingGoals from './src/screens/onboarding/OnboardingGoals';
import OnboardingSchedule from './src/screens/onboarding/OnboardingSchedule';

// Main
import HomeScreen from './src/screens/main/HomeScreen';
import CreateGameScreen from './src/screens/main/CreateGameScreen';
import ProfileScreen from './src/screens/main/ProfileScreen';
import SearchScreen from './src/screens/main/SearchScreen';
import MessagesListScreen from './src/screens/main/MessagesListScreen';
import ChatScreen from './src/screens/main/ChatScreen';
import GameDetailsScreen from './src/screens/main/GameDetailsScreen';

// Booking
import ClubDetailsScreen from './src/screens/booking/ClubDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          backgroundColor: '#2c2b15', 
          borderTopColor: '#3d3d20',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          elevation: 0,
          borderTopWidth: 1
        },
        tabBarActiveTintColor: '#f9f506',
        tabBarInactiveTintColor: '#6b6b60',
        tabBarLabelStyle: { fontFamily: 'SplineSans_600SemiBold', fontSize: 10 }
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Home', tabBarIcon: ({ color }) => <MaterialIcons name="home" size={28} color={color} /> }}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchScreen} 
        options={{ tabBarLabel: 'Buscar', tabBarIcon: ({ color }) => <MaterialIcons name="search" size={28} color={color} /> }}
      />
      <Tab.Screen 
        name="CreateTab" 
        component={CreateGameScreen} 
        options={{
          tabBarLabel: () => null,
          tabBarIcon: () => (
            <View className="bg-white h-16 w-16 rounded-full justify-center items-center -mt-10 shadow-lg border-4 border-background-dark">
               <MaterialIcons name="sports-tennis" size={32} color="#000" />
            </View>
          ),
        }}
      />
      <Tab.Screen 
        name="MessagesTab" 
        component={MessagesListScreen} 
        options={{ tabBarLabel: 'Msgs', tabBarIcon: ({ color }) => <MaterialIcons name="chat-bubble" size={26} color={color} /> }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Perfil', tabBarIcon: ({ color }) => <MaterialIcons name="person" size={28} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    SplineSans_700Bold, SplineSans_600SemiBold, SplineSans_400Regular,
    NotoSans_700Bold, NotoSans_500Medium, NotoSans_400Regular,
  });

  if (!fontsLoaded) return <ActivityIndicator size="large" color="#f9f506" />;

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#23220f" translucent={false} />
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OnboardingLevel" component={OnboardingLevel} />
        <Stack.Screen name="OnboardingGoals" component={OnboardingGoals} />
        <Stack.Screen name="OnboardingSchedule" component={OnboardingSchedule} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="ClubDetails" component={ClubDetailsScreen} />
        <Stack.Screen name="GameDetails" component={GameDetailsScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
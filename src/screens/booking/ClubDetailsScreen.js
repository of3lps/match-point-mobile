import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Dados Mockados
const CLUB_DATA = {
  id: '1',
  name: "Academia Play Tennis",
  rating: 4.8,
  reviews: 124,
  address: "R. Funchal, 120 - Vila Olímpia",
  distance: "2.4 km",
  description: "Referência em quadras de saibro na região. Contamos com iluminação LED profissional, vestiários completos e bar com vista para as quadras.",
  amenities: [
    { icon: "wifi", label: "Wi-Fi" },
    { icon: "local-parking", label: "Estacionamento" },
    { icon: "shower", label: "Vestiário" },
    { icon: "sports-bar", label: "Bar" },
  ],
  pricePerHour: 120.00,
  images: [
    "https://images.unsplash.com/photo-1622163642998-1ea3130026e9?q=80",
    "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80",
  ]
};

const TimeSlot = ({ time, price, status, isSelected, onSelect }) => {
  const isAvailable = status === 'available';
  return (
    <TouchableOpacity 
      disabled={!isAvailable}
      onPress={onSelect}
      className={`
        mr-3 px-4 py-3 rounded-xl border items-center justify-center min-w-[80px]
        ${isSelected ? 'bg-primary border-primary' : ''}
        ${!isSelected && isAvailable ? 'bg-surface-dark border-gray-700' : ''}
        ${!isAvailable ? 'bg-gray-800/50 border-transparent opacity-50' : ''}
      `}
    >
      <Text className={`font-bold ${isSelected ? 'text-black' : 'text-white'}`}>{time}</Text>
      {isAvailable && (
        <Text className={`text-[10px] mt-1 ${isSelected ? 'text-black' : 'text-gray-400'}`}>R$ {price}</Text>
      )}
    </TouchableOpacity>
  );
};

const ClubDetailsScreen = ({ navigation }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(0);

  const slots = [
    { id: '1', time: '18:00', status: 'booked' },
    { id: '2', time: '19:00', status: 'available' },
    { id: '3', time: '20:00', status: 'available' },
    { id: '4', time: '21:00', status: 'available' },
  ];

  return (
    <View className="flex-1 bg-background-dark">
      <StatusBar barStyle="light-content" />
      <ScrollView className="flex-1 pb-32" showsVerticalScrollIndicator={false}>
        
        {/* Carrossel de Imagens */}
        <View className="h-72 relative">
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {CLUB_DATA.images.map((img, index) => (
              <Image key={index} source={{ uri: img }} className="w-screen h-72" resizeMode="cover" />
            ))}
          </ScrollView>
          
          <SafeAreaView className="absolute top-0 w-full flex-row justify-between px-4 pt-2">
            <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 rounded-full bg-black/50 items-center justify-center">
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-black/50 items-center justify-center">
              <MaterialIcons name="favorite-border" size={24} color="white" />
            </TouchableOpacity>
          </SafeAreaView>

          <View className="absolute bottom-4 right-4 bg-surface-dark px-3 py-1.5 rounded-lg flex-row items-center gap-1 shadow-lg">
             <MaterialIcons name="star" size={16} color="#f9f506" />
             <Text className="text-white font-bold">{CLUB_DATA.rating}</Text>
             <Text className="text-gray-400 text-xs">({CLUB_DATA.reviews})</Text>
          </View>
        </View>

        {/* Informações */}
        <View className="px-5 pt-6">
          <Text className="text-white text-3xl font-display font-bold leading-tight">{CLUB_DATA.name}</Text>
          <View className="flex-row items-center gap-1 mt-2 mb-4">
             <MaterialIcons name="location-on" size={16} color="#8c8b5f" />
             <Text className="text-gray-400 text-sm font-body">{CLUB_DATA.address} • {CLUB_DATA.distance}</Text>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-6">
            {CLUB_DATA.amenities.map((item, index) => (
              <View key={index} className="flex-row items-center gap-1 bg-surface-dark border border-gray-800 px-3 py-1.5 rounded-full">
                <MaterialIcons name={item.icon} size={14} color="#f9f506" />
                <Text className="text-gray-300 text-xs font-medium">{item.label}</Text>
              </View>
            ))}
          </View>

          <Text className="text-gray-300 leading-relaxed mb-8 font-body">{CLUB_DATA.description}</Text>

          {/* Reserva */}
          <View className="mb-8">
            <Text className="text-white text-xl font-display font-bold mb-4">Reservar Quadra</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
               {['Hoje', 'Amanhã', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
                 <TouchableOpacity 
                    key={index}
                    onPress={() => setSelectedDate(index)}
                    className={`mr-3 items-center justify-center w-14 h-16 rounded-xl border ${selectedDate === index ? 'bg-white border-white' : 'bg-surface-dark border-gray-800'}`}
                 >
                    <Text className={`text-xs font-bold uppercase mb-1 ${selectedDate === index ? 'text-black' : 'text-gray-500'}`}>{day}</Text>
                    <Text className={`text-lg font-bold ${selectedDate === index ? 'text-black' : 'text-white'}`}>{14 + index}</Text>
                 </TouchableOpacity>
               ))}
            </ScrollView>

            <Text className="text-gray-400 text-sm mb-3 font-medium">Quadra de Saibro (Coberta)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {slots.map((slot) => (
                <TimeSlot 
                  key={slot.id}
                  time={slot.time}
                  price={CLUB_DATA.pricePerHour}
                  status={slot.status}
                  isSelected={selectedSlot === slot.id}
                  onSelect={() => setSelectedSlot(slot.id)}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Footer Checkout */}
      <View className="absolute bottom-0 w-full bg-surface-dark border-t border-gray-800 p-5 pb-8">
        <View className="flex-row items-center justify-between">
           <View>
              <Text className="text-gray-400 text-xs uppercase font-bold">Total a pagar</Text>
              <View className="flex-row items-end gap-1">
                 <Text className="text-white text-2xl font-bold">R$ {selectedSlot ? CLUB_DATA.pricePerHour.toFixed(2) : '0,00'}</Text>
                 <Text className="text-gray-400 text-sm mb-1">/ hora</Text>
              </View>
           </View>
           
           <TouchableOpacity 
             disabled={!selectedSlot}
             className={`px-8 h-14 rounded-full flex-row items-center justify-center gap-2 shadow-lg ${selectedSlot ? 'bg-primary shadow-primary/20' : 'bg-gray-700'}`}
           >
              <Text className={`font-bold text-lg ${selectedSlot ? 'text-black' : 'text-gray-400'}`}>Confirmar</Text>
              <MaterialIcons name="arrow-forward" size={20} color={selectedSlot ? 'black' : '#9ca3af'} />
           </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ClubDetailsScreen;
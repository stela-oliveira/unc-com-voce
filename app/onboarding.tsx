import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnboardingScreen() {
  const handleProximo = async () => {
    await AsyncStorage.setItem("@onboarding_done", "true");
    router.replace("/login");
  };

  return (
    <View className="flex-1 bg-white">
      {/* Imagem ilustrativa no topo */}
      <View className="flex-1 bg-blue-50 items-center justify-center">
        <Image
          source={require("../assets/images/onboarding-illustration.png")}
          className="w-72 h-72"
          resizeMode="contain"
        />
      </View>

      {/* Conteúdo inferior */}
      <View className="px-8 pb-12 pt-8">
        <Text className="text-2xl font-bold text-gray-900 mb-3">
          Bem-vindo ao UNC com você: sua universidade na palma da mão.
        </Text>
        <Text className="text-gray-500 text-base mb-8">
          Fique por dentro de todos os editais e eventos da Universidade do Contestado.
        </Text>

        <TouchableOpacity
          onPress={handleProximo}
          className="bg-unc-blue py-4 rounded-xl items-center"
        >
          <Text className="text-white font-semibold text-base">Próximo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
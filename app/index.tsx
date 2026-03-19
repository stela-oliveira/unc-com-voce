import { useEffect } from "react";
import { View, Image } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";

export default function LoadingScreen() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      // Verifica se já viu o onboarding
      const onboardingDone = await AsyncStorage.getItem("@onboarding_done");
      const user = auth().currentUser;

      if (user) {
        router.replace("/(tabs)");
      } else if (!onboardingDone) {
        router.replace("/onboarding");
      } else {
        router.replace("/login");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-unc-blue items-center justify-center">
      <Image
        source={require("../assets/images/logo-unc.png")}
        className="w-40 h-40"
        resizeMode="contain"
      />
    </View>
  );
}
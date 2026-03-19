import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { signInWithGoogle } from "../lib/auth";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);

  const handleGoogleLogin = async () => {
    if (!termosAceitos) {
      Alert.alert("Atenção", "Aceite os termos e a política de privacidade para continuar.");
      return;
    }
    setLoading(true);
    try {
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Erro ao entrar", error.message ?? "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Área azul com wave */}
      <View className="bg-unc-blue rounded-b-[40px] pt-20 pb-16 px-8 items-center">
        <Image
          source={require("../assets/images/logo-unc-white.png")}
          className="w-20 h-20 mb-6"
          resizeMode="contain"
        />
        <Text className="text-white text-2xl font-bold mb-2">
          Pronto para começar?
        </Text>
        <Text className="text-blue-200 text-base text-center">
          Entre com seu email institucional
        </Text>
      </View>

      {/* Área branca */}
      <View className="flex-1 px-8 pt-10 pb-8 justify-between">
        <View>
          <Text className="text-gray-500 text-sm text-center mb-8">
            Continue com
          </Text>

          {/* Checkbox Termos */}
          <TouchableOpacity
            onPress={() => setTermosAceitos(!termosAceitos)}
            className="flex-row items-start mb-8 gap-3"
          >
            <View
              className={`w-5 h-5 rounded border-2 mt-0.5 items-center justify-center ${
                termosAceitos ? "bg-unc-blue border-unc-blue" : "border-gray-400"
              }`}
            >
              {termosAceitos && (
                <Text className="text-white text-xs font-bold">✓</Text>
              )}
            </View>
            <Text className="text-gray-600 text-sm flex-1">
              Li e concordo com os{" "}
              <Text className="text-unc-blue font-semibold">Termos e Condições</Text>
              {" "}e a{" "}
              <Text className="text-unc-blue font-semibold">Política de Privacidade</Text>
            </Text>
          </TouchableOpacity>

          {/* Botão Google */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={loading}
            className="flex-row items-center justify-center border border-gray-200 rounded-full py-4 px-6 bg-white shadow-sm"
          >
            {loading ? (
              <ActivityIndicator color="#0D2B6E" />
            ) : (
              <>
                <Image
                  source={{ uri: "https://www.google.com/favicon.ico" }}
                  className="w-5 h-5 mr-3"
                />
                <Text className="text-gray-700 font-medium text-base">
                  Entrar com Google
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Text className="text-center text-gray-400 text-xs mt-8">
          Use seu email institucional (@aluno.unc.br, @professor.unc.br, @unc.br)
        </Text>
      </View>
    </ScrollView>
  );
}
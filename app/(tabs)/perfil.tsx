import { View, Text, Switch, TouchableOpacity, Alert } from "react-native";
import { Bell, Shield, LogOut } from "lucide-react-native";
import { useAuth } from "../../hooks/useAuth";
import { signOut } from "../../lib/auth";
import { router } from "expo-router";
import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

export default function PerfilScreen() {
  const { usuario } = useAuth();
  const [notifEnabled, setNotifEnabled] = useState(usuario?.notificacoes ?? true);

  const handleToggleNotif = async (value: boolean) => {
    setNotifEnabled(value);
    const uid = auth().currentUser?.uid;
    if (uid) {
      await firestore().collection("usuarios").doc(uid).update({
        notificacoes: value,
      });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: async () => {
            await signOut();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const iniciais = usuario?.nome
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?";

  const labelCategoria: Record<string, string> = {
    aluno: "Aluno",
    professor: "Professor",
    funcionario: "Funcionário",
    externo: "Externo",
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-unc-blue pt-14 pb-8 px-5">
        <Text className="text-white text-2xl font-bold mb-4">Perfil</Text>
        {/* Card do usuário */}
        <View className="bg-unc-blue-light rounded-2xl p-4 flex-row items-center">
          <View className="w-14 h-14 bg-white/20 rounded-full items-center justify-center mr-4">
            <Text className="text-white text-lg font-bold">{iniciais}</Text>
          </View>
          <View>
            <Text className="text-white font-bold text-lg">{usuario?.nome}</Text>
            <Text className="text-blue-300 text-sm">{usuario?.email}</Text>
            <View className="mt-1 bg-white/20 rounded-full px-3 py-0.5 self-start">
              <Text className="text-white text-xs">
                {labelCategoria[usuario?.categoria ?? "externo"]}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Configurações */}
      <View className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden">
        <Text className="text-gray-700 font-semibold text-base px-4 pt-4 mb-2">
          Configurações
        </Text>

        {/* Toggle Notificações */}
        <View className="flex-row items-center px-4 py-4 border-b border-gray-100">
          <View className="w-9 h-9 bg-gray-100 rounded-lg items-center justify-center mr-3">
            <Bell size={18} color="#374151" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-medium">Notificações</Text>
            <Text className="text-gray-400 text-xs">Receber alertas de eventos e editais</Text>
          </View>
          <Switch
            value={notifEnabled}
            onValueChange={handleToggleNotif}
            trackColor={{ false: "#E5E7EB", true: "#0D2B6E" }}
            thumbColor="white"
          />
        </View>

        {/* Privacidade e Segurança */}
        <TouchableOpacity className="flex-row items-center px-4 py-4">
          <View className="w-9 h-9 bg-gray-100 rounded-lg items-center justify-center mr-3">
            <Shield size={18} color="#374151" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-800 font-medium">Privacidade e Segurança</Text>
            <Text className="text-gray-400 text-xs">Alterar senha e configurações</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
      </View>

      {/* Sair */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mx-4 mt-4 flex-row items-center justify-center gap-2 py-4"
      >
        <LogOut size={18} color="#EF4444" />
        <Text className="text-red-500 font-semibold">Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}
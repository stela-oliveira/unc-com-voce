import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { SlidersHorizontal, Calendar } from "lucide-react-native";
import { useAuth } from "../../hooks/useAuth";
import { useNotificacoes } from "../../hooks/useNotificacoes";
import { Notificacao } from "../../types";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { isToday } from "date-fns";

type TabNotif = "todas" | "nao_lidas";

export default function NotificacoesScreen() {
  const { usuario } = useAuth();
  const { notificacoes } = useNotificacoes(usuario?.categoria);
  const [tabAtiva, setTabAtiva] = useState<TabNotif>("todas");

  const hoje = notificacoes.filter((n) => isToday(new Date(n.dataEnvio)));
  const anteriores = notificacoes.filter((n) => !isToday(new Date(n.dataEnvio)));
  const naoLidas = notificacoes.filter((n) => !n.lida);

  const naoLidasCount = naoLidas.length;

  const getIconByCategoria = (cat: Notificacao["categoria"]) => {
    if (cat === "eventos") return "📅";
    if (cat === "editais") return "📄";
    return "🔔";
  };

  const NotifItem = ({ item }: { item: Notificacao }) => (
    <View
      className={`bg-white rounded-xl p-4 mb-2 border-l-4 ${
        !item.lida ? "border-unc-blue" : "border-transparent"
      }`}
    >
      <View className="flex-row items-start gap-3">
        <View className="w-9 h-9 bg-green-50 rounded-lg items-center justify-center">
          <Text>{getIconByCategoria(item.categoria)}</Text>
        </View>
        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text className="text-gray-800 font-semibold text-sm">{item.titulo}</Text>
            <Text className="text-gray-400 text-xs">
              {formatDistanceToNow(new Date(item.dataEnvio), {
                addSuffix: false,
                locale: ptBR,
              })}{" "}
              atrás
            </Text>
          </View>
          <Text className="text-gray-500 text-sm mt-0.5">{item.mensagem}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-unc-blue pt-14 pb-6 px-5">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Notificações</Text>
            <Text className="text-blue-300 text-sm">
              Você tem {naoLidasCount} notificações não lidas
            </Text>
          </View>
          <SlidersHorizontal size={22} color="white" />
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white px-4 py-2 border-b border-gray-100">
        <TouchableOpacity
          onPress={() => setTabAtiva("todas")}
          className={`flex-1 py-2 rounded-lg items-center ${
            tabAtiva === "todas" ? "bg-white shadow-sm border border-gray-200" : ""
          }`}
        >
          <Text className={tabAtiva === "todas" ? "text-gray-800 font-medium" : "text-gray-500"}>
            Todas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTabAtiva("nao_lidas")}
          className={`flex-1 py-2 rounded-lg items-center ${
            tabAtiva === "nao_lidas" ? "bg-white shadow-sm border border-gray-200" : ""
          }`}
        >
          <Text className={tabAtiva === "nao_lidas" ? "text-gray-800 font-medium" : "text-gray-500"}>
            Não lidas ({naoLidasCount})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tabAtiva === "todas" ? notificacoes : naoLidas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          tabAtiva === "todas" ? (
            <>
              {hoje.length > 0 && (
                <Text className="text-xs font-semibold text-gray-400 uppercase mb-2">
                  Hoje
                </Text>
              )}
            </>
          ) : null
        }
        renderItem={({ item }) => <NotifItem item={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-10">
            Nenhuma notificação.
          </Text>
        }
      />
    </View>
  );
}
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Search } from "lucide-react-native";
import { useAuth } from "../../hooks/useAuth";
import { useEventos } from "../../hooks/useEventos";
import { useEditais } from "../../hooks/useEditais";
import { FeedCard } from "../../components/EventCard";
import { FeedItem } from "../../types";
import { useState, useMemo } from "react";

type Tab = "todos" | "eventos" | "editais";

export default function HomeScreen() {
  const { usuario } = useAuth();
  const { eventos } = useEventos();
  const { editais } = useEditais();
  const [tabAtiva, setTabAtiva] = useState<Tab>("todos");
  const [busca, setBusca] = useState("");

  const feedItems = useMemo<FeedItem[]>(() => {
    let items: FeedItem[] = [];
    if (tabAtiva === "todos" || tabAtiva === "eventos") {
      items = [...items, ...eventos.map((e) => ({ ...e, tipo: "evento" as const }))];
    }
    if (tabAtiva === "todos" || tabAtiva === "editais") {
      items = [...items, ...editais.map((e) => ({ ...e, tipo: "edital" as const }))];
    }
    if (busca.trim()) {
      items = items.filter((i) =>
        i.titulo.toLowerCase().includes(busca.toLowerCase())
      );
    }
    return items;
  }, [eventos, editais, tabAtiva, busca]);

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "Usuário";
  const iniciais = primeiroNome.charAt(0).toUpperCase();

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header azul com borda arredondada embaixo */}
      <View
        className="bg-unc-blue pt-14 pb-8 px-5"
        style={{ borderBottomLeftRadius: 32, borderBottomRightRadius: 32 }}
      >
        {/* Nome e avatar */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-white text-2xl font-bold">Olá, {primeiroNome}</Text>
          <View className="w-10 h-10 bg-blue-400 rounded-full items-center justify-center">
            <Text className="text-white font-bold text-base">{iniciais}</Text>
          </View>
        </View>
        <Text className="text-blue-300 text-sm mb-5">
          Seus eventos e editais em um só lugar
        </Text>

        {/* Barra de busca menor, sem botão de filtro */}
        <View className="flex-row items-center bg-white rounded-xl px-3 py-2">
          <Search size={16} color="#9CA3AF" />
          <TextInput
            className="flex-1 text-gray-700 text-sm ml-2"
            placeholder="Buscar eventos, editais..."
            placeholderTextColor="#9CA3AF"
            value={busca}
            onChangeText={setBusca}
          />
        </View>
      </View>

      {/* Tabs centralizadas dentro de um card */}
      <View className="mx-4 mt-4 bg-white rounded-2xl p-1.5 flex-row justify-center shadow-sm">
        {(["todos", "eventos", "editais"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setTabAtiva(tab)}
            className={`flex-1 py-2 rounded-xl items-center ${
              tabAtiva === tab ? "bg-unc-blue" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                tabAtiva === tab ? "text-white" : "text-gray-500"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de cards */}
      <FlatList
        data={feedItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FeedCard tipo={item.tipo} item={item as any} />
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text className="text-center text-gray-400 mt-10">
            Nenhum item encontrado.
          </Text>
        }
      />
    </View>
  );
}
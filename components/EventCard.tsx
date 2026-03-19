import { View, Text, Image, TouchableOpacity } from "react-native";
import { ExternalLink, Calendar } from "lucide-react-native";
import { Evento, Edital } from "../types";
import { imagensEventos } from "../constants/imagensEventos";
import { imagemDefault } from "../constants/imagensEventos";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Instale: npm install date-fns ou npm install date-fns --legacy-peer-deps se n der

type CardProps =
  | { tipo: "evento"; item: Evento }
  | { tipo: "edital"; item: Edital };

export function FeedCard(props: CardProps) {
  const { tipo, item } = props;
  const isEvento = tipo === "evento";
  const evento = isEvento ? (item as Evento) : null;
  const edital = !isEvento ? (item as Edital) : null;

  const dataFormatada = format(
    new Date(isEvento ? evento!.data : edital!.dataPublicacao),
    "dd 'de' MMM.",
    { locale: ptBR },
  );

  const labelConfig = isEvento
    ? { bg: "bg-green-100", text: "text-green-700", label: "EVENTO" }
    : {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: edital?.categoria?.toUpperCase() ?? "EDITAL",
      };

  const autor = isEvento ? evento?.autor : edital?.autor;

  return (
    <View className="bg-white rounded-2xl mb-4 shadow-sm border border-gray-100">
      {/* Imagem com padding lateral e topo, bordas arredondadas */}
      {(isEvento ||
        (!isEvento && (edital?.imagemUrl || edital?.imagemKey))) && (
        <View className="px-4 pt-4">
          <View
            className="w-full bg-gray-100 overflow-hidden"
            style={{ borderRadius: 12, height: 160 }}
          >
            <Image
              source={
                isEvento
                  ? evento?.imagemUrl
                    ? { uri: evento.imagemUrl }
                    : evento?.imagemKey && imagensEventos[evento.imagemKey]
                      ? imagensEventos[evento.imagemKey]
                      : imagemDefault
                  : edital?.imagemUrl
                    ? { uri: edital.imagemUrl }
                    : edital?.imagemKey && imagensEventos[edital.imagemKey]
                      ? imagensEventos[edital.imagemKey]
                      : imagemDefault
              }
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        </View>
      )}

      {/* Conteúdo do card */}
      <View className="p-4">
        {/* Badge + data */}
        <View className="flex-row justify-between items-center mb-2">
          <View className={`px-2.5 py-0.5 rounded-full ${labelConfig.bg}`}>
            <Text className={`text-xs font-semibold ${labelConfig.text}`}>
              {labelConfig.label}
            </Text>
          </View>
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Calendar size={12} color="#9CA3AF" />
            <Text className="text-gray-400 text-xs">{dataFormatada}</Text>
          </View>
        </View>

        {/* Título */}
        <Text className="text-gray-900 font-bold text-base mb-1">
          {item.titulo}
        </Text>

        {/* Descrição */}
        <Text className="text-gray-500 text-sm mb-3" numberOfLines={2}>
          {item.descricao}
        </Text>

        {/* Rodapé */}
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-400 text-xs">{autor ?? ""}</Text>
          <TouchableOpacity
            className="flex-row items-center"
            style={{ gap: 4 }}
          >
            <Text className="text-unc-blue font-semibold text-sm">
              Ver mais
            </Text>
            <ExternalLink size={13} color="#0D2B6E" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

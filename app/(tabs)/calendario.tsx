import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useEventos } from "../../hooks/useEventos";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export default function CalendarioScreen() {
  const { eventos } = useEventos();
  const [mesAtual, setMesAtual] = useState(new Date());
  const [diaSelecionado, setDiaSelecionado] = useState(new Date());

  const diasDoMes = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(mesAtual),
        end: endOfMonth(mesAtual),
      }),
    [mesAtual],
  );

  const offsetInicio = getDay(startOfMonth(mesAtual));

  const eventosDoDia = useMemo(
    () => eventos.filter((e) => isSameDay(new Date(e.data), diaSelecionado)),
    [eventos, diaSelecionado],
  );

  const mesAno = format(mesAtual, "MMMM yyyy", { locale: ptBR });
  const mesAnoFormatado = mesAno.charAt(0).toUpperCase() + mesAno.slice(1);
  const diasSemana = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header + Card sobrepostos usando zIndex */}
      <View>
        {/* Header azul */}
        <View className="bg-unc-blue pt-14 px-5 pb-16">
          <Text className="text-white text-2xl font-bold">Calendário</Text>
        </View>

        {/* Card calendário sobreposto */}
        <View
          className="mx-4 bg-white rounded-2xl p-4"
          style={{
            marginTop: -40,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {/* Navegação mês */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() => setMesAtual(subMonths(mesAtual, 1))}
              className="p-1"
            >
              <ChevronLeft size={20} color="#374151" />
            </TouchableOpacity>
            <Text className="text-gray-800 font-semibold text-base">
              {mesAnoFormatado}
            </Text>
            <TouchableOpacity
              onPress={() => setMesAtual(addMonths(mesAtual, 1))}
              className="p-1"
            >
              <ChevronRight size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Dias da semana */}
          <View className="flex-row mb-1">
            {diasSemana.map((d) => (
              <View key={d} style={{ flex: 1, alignItems: "center" }}>
                <Text className="text-gray-400 text-xs font-medium">{d}</Text>
              </View>
            ))}
          </View>

          {/* Grade de dias */}
          <View className="flex-row flex-wrap">
            {Array.from({ length: offsetInicio }).map((_, i) => (
              <View
                key={`e-${i}`}
                style={{ width: `${100 / 7}%`, height: 60 }}
              />
            ))}
            {diasDoMes.map((dia) => {
              const temEvento = eventos.some((e) =>
                isSameDay(new Date(e.data), dia),
              );
              const selecionado = isSameDay(dia, diaSelecionado);
              return (
                <View
                  key={dia.toISOString()}
                  style={{
                    width: `${100 / 7}%`,
                    height: 60,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setDiaSelecionado(dia)}
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: selecionado ? "#0D2B6E" : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: selecionado || temEvento ? "900" : "400",
                        color: selecionado
                          ? "#FFFFFF"
                          : temEvento
                            ? "#0D2B6E"
                            : "#374151",
                      }}
                    >
                      {format(dia, "d")}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Scroll apenas para os eventos */}
      <ScrollView
        className="flex-1 px-4 mt-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Text className="text-gray-800 font-semibold text-base mb-3">
          Eventos de {format(diaSelecionado, "dd 'de' MMMM", { locale: ptBR })}
        </Text>

        {eventosDoDia.length === 0 ? (
          <Text className="text-gray-400 text-sm">
            Nenhum evento neste dia.
          </Text>
        ) : (
          eventosDoDia.map((evento) => (
            <View
              key={evento.id}
              className="flex-row bg-white rounded-xl p-4 mb-3"
              style={{
                elevation: 2,
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 4,
              }}
            >
              <View
                className="bg-unc-blue rounded-xl items-center justify-center mr-4"
                style={{ width: 56, height: 56 }}
              >
                <Text className="text-blue-200 text-xs uppercase font-medium">
                  {format(new Date(evento.data), "MMM", { locale: ptBR })}
                </Text>
                <Text className="text-white font-bold text-xl leading-6">
                  {format(new Date(evento.data), "dd")}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-semibold text-sm mb-1">
                  {evento.titulo}
                </Text>
                <Text
                  className="text-gray-500 text-xs leading-4"
                  numberOfLines={3}
                >
                  {evento.descricao}
                </Text>
                <Text className="text-gray-400 text-xs mt-1.5">
                  {format(new Date(evento.data), "HH:mm")}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

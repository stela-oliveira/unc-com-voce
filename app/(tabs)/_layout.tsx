import { Tabs } from "expo-router";
import { Home, Calendar, Bell, User } from "lucide-react-native";
import { View, Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: "#0D2B6E",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="calendario"
        options={{
          title: "Calendário",
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notificacoes"
        options={{
          title: "Notificações",
          tabBarIcon: ({ color, size, focused }) => (
            <View>
              <Bell color={color} size={size} />
              {/* Badge de não lidas */}
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 items-center justify-center">
                <Text className="text-white text-[9px] font-bold">2</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
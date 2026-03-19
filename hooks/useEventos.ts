import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Evento } from "../types";

export function useEventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("eventos")
      .orderBy("data", "desc")
      .onSnapshot((snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Evento[];
        setEventos(data);
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  return { eventos, loading };
}
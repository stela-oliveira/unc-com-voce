import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Edital } from "../types";

export function useEditais() {
  const [editais, setEditais] = useState<Edital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("editais")
      .orderBy("dataPublicacao", "desc")
      .onSnapshot((snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Edital[];
        setEditais(data);
        setLoading(false);
      });
    return unsubscribe;
  }, []);

  return { editais, loading };
}
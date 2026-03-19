import { useEffect, useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { Notificacao, UserCategoria } from "../types";

export function useNotificacoes(categoriaUsuario: UserCategoria | undefined) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoriaUsuario) return;

    const unsubscribe = firestore()
      .collection("notificacoes")
      .where("usuariosAlvo", "array-contains", categoriaUsuario)
      .orderBy("dataEnvio", "desc")
      .onSnapshot((snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Notificacao[];
        setNotificacoes(data);
        setLoading(false);
      });
    return unsubscribe;
  }, [categoriaUsuario]);

  return { notificacoes, loading };
}
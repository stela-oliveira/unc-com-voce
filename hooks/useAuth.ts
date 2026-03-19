import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Usuario } from "../types";

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const doc = await firestore().collection("usuarios").doc(user.uid).get();
        // modifiquei aqui, pois o doc.data() estava dando erro de tipo, e o doc.exists não estava sendo reconhecido
        if ((doc as any).exists) {
          setUsuario(doc.data() as Usuario);
        }
      } else {
        setUsuario(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { usuario, loading };
}
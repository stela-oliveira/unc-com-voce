import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { UserCategoria, Usuario } from "../types";

function getCategoriaByEmail(email: string): UserCategoria {
  if (email.endsWith("@aluno.unc.br")) return "aluno";
  if (email.endsWith("@professor.unc.br")) return "professor";
  if (email.endsWith("@unc.br")) return "funcionario";
  return "externo";
}

export async function signInWithGoogle(): Promise<Usuario> {
  // Google Sign-In com o webClientId do Firebase
  GoogleSignin.configure({
    webClientId: "502503188763-ksupnt1r2mmvfv1hamg5a8v9rqd9999j.apps.googleusercontent.com",
  });

  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  const { data } = await GoogleSignin.signIn();
  const googleCredential = auth.GoogleAuthProvider.credential(data!.idToken);
  const userCredential = await auth().signInWithCredential(googleCredential);

  const { uid, email, displayName } = userCredential.user;
  const categoria = getCategoriaByEmail(email ?? "");

  const userRef = firestore().collection("usuarios").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const novoUsuario: Usuario = {
      id: uid,
      nome: displayName ?? "Usuário",
      email: email ?? "",
      categoria,
      notificacoes: true,
      createdAt: new Date().toISOString(),
    };
    await userRef.set(novoUsuario);
    return novoUsuario;
  }

  return userDoc.data() as Usuario;
}

export async function signOut(): Promise<void> {
  await GoogleSignin.signOut();
  await auth().signOut();
}
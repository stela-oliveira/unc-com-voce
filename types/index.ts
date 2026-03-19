export type UserCategoria = "aluno" | "professor" | "funcionario" | "externo";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  categoria: UserCategoria;
  notificacoes: boolean;
  createdAt: string;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  data: string; // ISO 8601
  imagemUrl?: string;
  imagemKey?: string; // chave para imagens locais
  autor?: string;
}

export interface Edital {
  id: string;
  titulo: string;
  descricao: string;
  categoria: "rematricula" | "bolsa" | "vestibular" | "processo_seletivo" | "outro";
  dataPublicacao: string; // ISO 8601
  autor: string;
  pdfUrl: string; // URL do PDF no Firebase Storage
  imagemUrl?: string;
  imagemKey?: string; // chave para imagens locais
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  dataEnvio: string; // ISO 8601
  usuariosAlvo: UserCategoria[];
  categoria: "editais" | "eventos" | "geral";
  lida?: boolean; // salvo localmente no device
}

export type FeedItem = 
  | (Evento & { tipo: "evento" })
  | (Edital & { tipo: "edital" });
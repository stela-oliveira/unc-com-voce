# UNC Com Você

Aplicativo mobile para alunos, professores, funcionários e externos da Universidade do Contestado. Permite visualização e notificação de editais (em PDF) e eventos da universidade.

---

## Requisitos do ambiente

Antes de clonar e rodar o projeto, você precisa ter instalado na máquina:

**Node.js v20 LTS**
Baixe em https://nodejs.org/en/download — escolha a versão 20 LTS. Verifique com `node --version`.

**Java JDK 21**
Necessário para o Android Studio compilar o app. Baixe em https://www.oracle.com/java/technologies/downloads. Verifique com `java -version`.

**Android Studio**
Necessário para emular e compilar o app Android. Baixe em https://developer.android.com/studio.
Após instalar, abra o Android Studio e instale:
- Android SDK (API 35 recomendado)
- Android Emulator
- Android SDK Build-Tools

**Git**
Baixe em https://git-scm.com/downloads.

**Expo CLI**
Não precisa instalar globalmente. O projeto usa `npx expo` diretamente.

---

## Variáveis de ambiente obrigatórias

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=SEU_WEB_CLIENT_ID.apps.googleusercontent.com
```

O Web Client ID é encontrado no Firebase Console em:
Autenticação > Método de login > Google > ID do cliente da Web

---

## Arquivos necessários que não estão no repositório

Estes arquivos contêm chaves sensíveis e foram ignorados pelo `.gitignore`. Você precisa obtê-los com o administrador do projeto ou pelo Firebase Console.

`google-services.json` — coloque na raiz do projeto
Obtido no Firebase Console em: Configurações do projeto > aba Geral > app Android > baixar google-services.json

`GoogleService-Info.plist` — coloque na raiz do projeto
Obtido no Firebase Console em: Configurações do projeto > aba Geral > app iOS > baixar GoogleService-Info.plist

---

## Como rodar o projeto

Clone o repositório:
```
git clone https://github.com/stela-oliveira/unc-com-voce.git
cd unc-com-voce
```

Instale as dependências:
```
npm install
```

Rode no Android (necessita Android Studio com emulador configurado ou dispositivo físico via USB):
```
npx expo run:android
```

Após a primeira compilação, para iniciar apenas o servidor Metro sem recompilar:
```
npx expo start --clear
```

---

## Configuração do Android Studio

Após instalar o Android Studio:

1. Abra o Android Studio e vá em More Actions > Virtual Device Manager
2. Clique em Create Device
3. Escolha um dispositivo (ex: Medium Phone)
4. Escolha a imagem do sistema — recomendado API 35 (Android 15)
5. Finalize e inicie o emulador clicando no botão Play

Certifique-se também de configurar as variáveis de ambiente do Android SDK. No Windows, adicione nas variáveis de ambiente do sistema:

```
ANDROID_HOME = C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk
```

E adicione ao Path:
```
%ANDROID_HOME%\tools
%ANDROID_HOME%\tools\bin
%ANDROID_HOME%\platform-tools
```

---

## SHA-1 para Google Sign-In

O login com Google exige que a impressão digital SHA-1 do keystore esteja cadastrada no Firebase Console. Para gerar a SHA-1 do debug keystore na nova máquina:

No Windows (PowerShell):
```
keytool -list -v -keystore "$env:USERPROFILE\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

No Mac/Linux:
```
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
```

Copie o valor SHA1 e cadastre no Firebase Console em:
Configurações do projeto > app Android > Adicionar impressão digital

Depois baixe o `google-services.json` atualizado e substitua na raiz do projeto. Então recompile com `npx expo run:android`.

---

## Dependências do projeto

Estas são instaladas automaticamente pelo `npm install`:

### Dependências principais
```
npm install expo@~54.0.33 react@19.1.0 react-native@0.81.5
```
### Navegação
```
npm install expo-router@~6.0.23 react-native-safe-area-context@~5.6.0 react-native-screens@~4.16.0 expo-linking@~8.0.11 expo-constants@~18.0.13 expo-status-bar@~3.0.9
```
### Firebase
```
npm install @react-native-firebase/app@^23.8.6 @react-native-firebase/auth@^23.8.6 @react-native-firebase/firestore@^23.8.6
```
### Google Sign-In
```
npm install @react-native-google-signin/google-signin@^16.1.1
```
### Estilização
```
npm install nativewind@4.1.23 tailwindcss@3.4.17
```
### Utilitários
```
npm install date-fns@^4.1.0 @react-native-async-storage/async-storage@^2.2.0 expo-build-properties@~1.0.10 expo-dev-client@~6.0.20
```
### Ícones
```
npm install lucide-react-native@^0.575.0 react-native-svg@^15.15.3
```
### Worklets (dependência do NativeWind)
```
npm install react-native-worklets-core
```
### DevDependencies
```
npm install --save-dev babel-preset-expo @types/react@~19.1.0 typescript@~5.9.2
```
---

## Estrutura do Firestore

O app consome quatro coleções no Firestore. Os dados são inseridos pelo sistema PHP da universidade.

Coleção `usuarios` — criada automaticamente no primeiro login
```
id: string (uid do Firebase Auth)
nome: string
email: string
categoria: "aluno" | "professor" | "funcionario" | "externo"
notificacoes: boolean
createdAt: string (ISO 8601)
```

Coleção `eventos`
```
id: string
titulo: string
descricao: string
data: string (ISO 8601)
imagemUrl: string (opcional — URL externa)
imagemKey: string (opcional — chave para imagem local em assets/images/eventos/)
autor: string (opcional)
```

Coleção `editais`
```
id: string
titulo: string
descricao: string
categoria: "rematricula" | "bolsa" | "vestibular" | "processo_seletivo" | "outro"
dataPublicacao: string (ISO 8601)
autor: string
pdfUrl: string (URL do PDF no Firebase Storage)
imagemUrl: string (opcional)
imagemKey: string (opcional)
```

Coleção `notificacoes`
```
id: string
titulo: string
mensagem: string
dataEnvio: string (ISO 8601)
usuariosAlvo: array de "aluno" | "professor" | "funcionario" | "externo"
categoria: "editais" | "eventos" | "geral"
```

---

## Regras de acesso por email

O tipo de usuário é determinado automaticamente pelo domínio do email no login:

- @aluno.unc.br = aluno
- @professor.unc.br = professor
- @unc.br = funcionario
- qualquer outro domínio = externo

---

## Observações importantes

O app não funciona no Expo Go padrão pois usa módulos nativos do Firebase. É obrigatório usar o Development Build via `npx expo run:android`.

O terminal usado deve ser PowerShell ou CMD no Windows. O Git Bash causa erros de caminho com o Metro bundler no Windows.

Na primeira execução do `npx expo run:android` a compilação pode demorar entre 5 e 15 minutos dependendo da máquina. As compilações seguintes são muito mais rápidas.

Imagens locais de eventos ficam em `assets/images/eventos/`. Para adicionar uma nova imagem local, salve o arquivo na pasta e registre a chave em `constants/imagensEventos.ts`.

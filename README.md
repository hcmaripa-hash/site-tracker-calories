Claro 👍
Segue um **README.md** simples, claro e pronto para usar no seu projeto **React Native com Expo**.

Você pode **copiar e colar direto** no arquivo `README.md` do repositório.

---

# 📱 Calorie Tracker

Aplicação desenvolvida com **React Native + Expo**, com suporte para **Web**, **Android** e **iOS**.

---

## 🚀 Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

* **Node.js** (versão 18 ou superior recomendada)
  👉 [https://nodejs.org](https://nodejs.org)
* **Git**
  👉 [https://git-scm.com](https://git-scm.com)
* **Expo CLI** (opcional, mas recomendado)

```bash
npm install -g expo-cli
```

---

## 📦 Instalação do projeto

1. Clone o repositório:

```bash
git clone https://github.com/hcmaripa-hash/calorie-tracker.git
```

2. Acesse a pasta do projeto:

```bash
cd calorie-tracker
```

3. Instale as dependências:

```bash
npm install
```

---

## ▶️ Executando o projeto

### 🔹 Modo desenvolvimento (Expo)

```bash
npx expo start
```

Após iniciar, o terminal mostrará um **QR Code** e algumas opções.

---

### 🌐 Executar no navegador (Web)

No terminal do Expo, pressione:

```
w
```

ou execute diretamente:

```bash
npx expo start --web
```

---

### 📱 Executar no celular (Android / iOS)

1. Instale o app **Expo Go** no celular:

   * Android: Play Store
   * iOS: App Store
2. Escaneie o **QR Code** exibido no terminal

---

### 🤖 Executar no emulador

* **Android**: Android Studio instalado
  Pressione:

  ```
  a
  ```
* **iOS (macOS)**: Xcode instalado
  Pressione:

  ```
  i
  ```

---

## 🏗️ Build para Web (GitHub Pages)

Para gerar a versão web estática:

```bash
npx expo export
```

Os arquivos gerados podem ser publicados no **GitHub Pages**.

⚠️ Certifique-se de configurar o `publicPath` corretamente no `app.json` para funcionar em subdiretórios.

---

## 📂 Estrutura do projeto (resumida)

```
calorie-tracker/
 ├── App.js
 ├── package.json
 ├── app.json
 ├── assets/
 └── node_modules/
```

---

## ❗ Problemas comuns

* **Tela branca no navegador**
  → Verifique caminhos relativos e configuração do `publicPath`
* **Erro de comando**
  → Use `npx expo start`, nunca `npx run web`

---

## 🛠️ Tecnologias utilizadas

* React Native
* Expo
* JavaScript
* Expo Web

---

## 👤 Autor

Desenvolvido por **Henrique Caregnato**


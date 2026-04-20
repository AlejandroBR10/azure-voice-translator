"# Azure Voice Translator

Una aplicación web moderna que convierte voz a texto, traduce contenido entre idiomas y sintetiza voz a partir de texto, utilizando los servicios cognitivos de Azure. Ofrece una experiencia fluida de traducción de voz en tiempo real con soporte para múltiples idiomas.

---

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Servicios de Azure](#servicios-de-azure)
- [Backend](#backend)
- [Frontend](#frontend)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Variables de Entorno](#variables-de-entorno)
- [API Endpoints](#api-endpoints)

---

## 📖 Descripción General

**Azure Voice Translator** es una solución completa de traducción de voz que integra capacidades de reconocimiento de voz, traducción de texto y síntesis de voz. La aplicación permite a los usuarios:

1. Grabar audio en español
2. Convertir el audio a texto mediante reconocimiento de voz
3. Traducir el texto a idiomas destino seleccionados
4. Reproducir la traducción en voz sintetizada

La arquitectura separa claramente las responsabilidades entre el backend (API REST) y el frontend (interfaz interactiva), facilitando el mantenimiento y la escalabilidad.

---

## ✨ Características

- **🎤 Reconocimiento de Voz**: Conversión de audio a texto en español (español mexicano - es-MX)
- **🌍 Traducción Multiidioma**: Soporte para 6 idiomas destino (inglés, francés, alemán, portugués, italiano, japonés)
- **🔊 Síntesis de Voz**: Conversión de texto traducido a audio sintetizado
- **💾 Descarga de Audio**: Capacidad de descargar archivos WAV grabados
- **🎯 Interfaz Moderna**: Diseño responsivo y amigable con el usuario
- **⚡ Procesamiento en Tiempo Real**: Flujo completo de traducción sin demoras significativas
- **🔐 CORS Habilitado**: Comunicación segura entre frontend y backend

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Vite)                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Interface HTML + CSS + JavaScript Modular            │   │
│  │ - Interfaz de Usuario Interactiva                    │   │
│  │ - Grabación de Audio                                 │   │
│  │ - Manejo de Estado                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Express.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Controllers - Manejo de Requests                     │   │
│  │ Services - Lógica de Negocio                         │   │
│  │ Routes - Definición de Endpoints                     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────────┐
│               SERVICIOS COGNITIVOS DE AZURE                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Speech to    │  │ Translator   │  │ Text to      │      │
│  │ Text         │  │ Service      │  │ Speech       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## ☁️ Servicios de Azure

### 1. **Azure Speech Service**

- **Propósito**: Reconocimiento de voz (Speech to Text) y síntesis de voz (Text to Speech)
- **Características**:
  - Conversión de audio WAV a texto en español mexicano
  - Síntesis de voz para reproducción de traducciones
  - Manejo automático de silencios y timeouts
  - Configuración de región: `westus2`
- **Configuración Requerida**:
  - `AZURE_SPEECH_KEY`: Clave de autenticación
  - `AZURE_REGION`: Región del servicio

### 2. **Azure Translator Service**

- **Propósito**: Traducción de texto a múltiples idiomas
- **Características**:
  - Soporte para 6 idiomas destino
  - API RESTful con versionado (v3.0)
  - Respuestas JSON estructuradas
  - Manejo de errores robusto
- **Configuración Requerida**:
  - `AZURE_TRANSLATOR_KEY`: Clave de autenticación
  - `AZURE_TRANSLATOR_ENDPOINT`: URL del endpoint

---

## 🖥️ Backend

### Descripción

El backend es una API REST construida con **Express.js** que orquesta las operaciones de reconocimiento de voz, traducción y síntesis. Utiliza middlewares modernos para CORS, parsing JSON y manejo de archivos.

### Dependencias Principales

```json
{
  "axios": "^1.15.0", // Cliente HTTP
  "cors": "^2.8.6", // Control de CORS
  "dotenv": "^17.4.1", // Gestión de variables de entorno
  "express": "^5.2.1", // Framework web
  "microsoft-cognitiveservices-speech-sdk": "^1.49.0", // SDK de Speech de Azure
  "multer": "^2.1.1" // Manejo de carga de archivos
}
```

### Estructura de Directorios

```
backend/
├── src/
│   ├── config/
│   │   └── azure.config.js          # Configuración centralizada de Azure
│   ├── controllers/
│   │   ├── flow.controller.js        # Controlador del flujo completo
│   │   ├── speech.controller.js      # Controlador de Speech to Text
│   │   ├── textToSpeech.controller.js # Controlador de Text to Speech
│   │   └── translate.controller.js   # Controlador de Traducción
│   ├── services/
│   │   ├── flow.service.js          # Lógica del flujo completo
│   │   ├── speech.service.js        # Lógica de Speech to Text
│   │   └── translator.service.js    # Lógica de Traducción
│   ├── routes/
│   │   ├── flow.routes.js           # Rutas del flujo completo
│   │   ├── speech.routes.js         # Rutas de Speech
│   │   ├── textToSpeech.routes.js   # Rutas de Text to Speech
│   │   └── translate.routes.js      # Rutas de Traducción
│   ├── app.js                        # Configuración de Express
│   └── server.js                     # Punto de entrada del servidor
└── uploads/                          # Almacenamiento temporal de archivos de audio
```

### Componentes Principales

#### **app.js - Configuración de Express**

- Inicialización de Express
- Habilitación de CORS para comunicación con frontend
- Middleware para parsing JSON
- Rutas principales de la API
- Endpoint de salud: `GET /` → "API funcionando 🚀"

#### **azure.config.js - Configuración Centralizada**

```javascript
export const azureConfig = {
  speechKey: process.env.AZURE_SPEECH_KEY,
  region: process.env.AZURE_REGION,
  translatorKey: process.env.AZURE_TRANSLATOR_KEY,
  translatorEndpoint: process.env.AZURE_TRANSLATOR_ENDPOINT,
};
```

#### **Services**

**speech.service.js** - Reconocimiento de Voz

- Convierte archivos WAV a texto
- Validación de formato WAV (headers RIFF/WAVE)
- Configuración de idioma: español mexicano (es-MX)
- Timeouts configurables:
  - Silencio inicial: 5 segundos
  - Silencio final: 1 segundo
- Retorna el texto reconocido

**translator.service.js** - Traducción de Texto

- Integración con Azure Translator Service
- Parámetros: texto y código de idioma destino
- Headers requeridos:
  - `Ocp-Apim-Subscription-Key`
  - `Ocp-Apim-Subscription-Region`
  - `Content-Type: application/json`
- Retorna texto traducido

**flow.service.js** - Flujo Completo

- Orquesta Speech to Text → Traducción → Text to Speech
- Manejo de errores en cada paso
- Retorna objeto con transcripción y audio sintetizado

#### **Controllers**

Manejan las solicitudes HTTP y coordinan las operaciones:

- `speechController`: Recibe archivos, llama a speech.service
- `translateController`: Recibe texto y idioma, llama a translator.service
- `textToSpeechController`: Genera audio sintetizado
- `flowController`: Ejecuta el flujo completo

#### **Routes**

Definen los endpoints de la API:

- `POST /api/translate` - Traducción de texto
- `POST /api/speech` - Speech to Text
- `POST /api/text-to-speech` - Text to Speech
- `POST /api/full-flow` - Flujo completo

### Scripts

```bash
npm start    # Ejecutar servidor en producción
npm run dev  # Ejecutar con nodemon (desarrollo)
```

---

## 🎨 Frontend

### Descripción

El frontend es una aplicación web moderna construida con **Vite** que proporciona una interfaz intuitiva para la traducción de voz. Utiliza JavaScript modular con una arquitectura de componentes clara.

### Dependencias Principales

```json
{
  "vite": "5.0.12" // Build tool y dev server ultrarrápido
}
```

### Estructura de Directorios

```
frontend/
├── public/                     # Archivos estáticos
├── src/
│   ├── modules/
│   │   ├── api.js             # Cliente API (axios wrapper)
│   │   ├── audio.js           # Utilidades de audio
│   │   ├── recording.js       # Lógica de grabación
│   │   ├── state.js           # Gestión de estado global
│   │   └── ui.js              # Renderizado de UI
│   ├── assets/                # Imágenes y recursos
│   ├── main.js                # Punto de entrada
│   ├── style.css              # Estilos principales
│   ├── index.html             # Plantilla HTML
│   └── counter.js             # Utilidades adicionales
```

### Módulos Principales

#### **state.js - Gestión de Estado**

- Estado centralizado de la aplicación
- Caché de elementos DOM
- Funciones para actualizar estado
- Mantiene sincronización entre lógica y UI

**Estado Global**:

```javascript
{
  isRecording: boolean,         // Estado de grabación
  audioBuffer: ArrayBuffer,     // Buffer de audio grabado
  originalText: string,         // Texto original (voz reconocida)
  translatedText: string,       // Texto traducido
  targetLanguage: string,       // Idioma destino seleccionado
  isProcessing: boolean         // Indica procesamiento en curso
}
```

#### **recording.js - Grabación de Audio**

- Captura de audio desde micrófono
- Conversión a formato WAV
- Gestión de permisos del micrófono
- Funciones principales:
  - `toggleRecording()`: Inicia/detiene grabación
  - `playAudio()`: Reproduce audio sintetizado
  - `downloadWav()`: Descarga archivo WAV

#### **api.js - Cliente HTTP**

- Wrapper de axios para comunicación con backend
- Funciones para cada endpoint:
  - `speechToText(audioBuffer)`: Convierte audio a texto
  - `translateText(text, targetLanguage)`: Traduce texto
  - `textToSpeech(text, language)`: Genera audio
  - `fullFlow(audioFile, targetLanguage)`: Flujo completo
- Manejo de errores centralizado

#### **ui.js - Interfaz de Usuario**

- Renderizado dinámico de la interfaz
- Estructura con dos columnas:
  - **Columna izquierda (Entrada)**: Grabación y texto original
  - **Columna derecha (Salida)**: Idioma destino y traducción
- Componentes principales:
  - Botón de grabación con estados
  - Selector de idioma destino (6 idiomas)
  - Áreas de texto (solo lectura)
  - Botones de acción (Descargar, Reproducir)
- Setup de event listeners

### Interfaz de Usuario

La aplicación presenta una interfaz de dos columnas:

**Columna Izquierda - Entrada**

- Badge de idioma: Español (fijo)
- Botón de grabación micrófono
- Estado de grabación
- Área de texto con transcripción
- Botón de descarga WAV

**Columna Derecha - Salida**

- Selector de idioma destino (dropdown)
- Área de texto con traducción
- Botón de reproducción de audio

### Idiomas Soportados

| Código | Idioma                 |
| ------ | ---------------------- |
| en     | English (Inglés)       |
| fr     | French (Francés)       |
| de     | German (Alemán)        |
| pt     | Portuguese (Portugués) |
| it     | Italian (Italiano)     |
| ja     | Japanese (Japonés)     |

### Scripts

```bash
npm run dev      # Ejecutar dev server (http://localhost:5173)
npm run build    # Compilar para producción
npm run preview  # Preview de build de producción
```

---

## 📋 Requisitos Previos

- **Node.js**: v16.0.0 o superior
- **npm**: v7.0.0 o superior
- **Cuenta de Azure**: Con servicios cognitivos activos
  - Azure Speech Service
  - Azure Translator Service
- **Navegador moderno**: Que soporte Web Audio API
- **Micrófono**: Para grabación de audio

---

## ⚙️ Instalación y Configuración

### 1. Clonar o Descargar el Repositorio

```bash
cd azure-voice-translator
```

### 2. Configurar Backend

```bash
cd backend
npm install
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

### 4. Crear Archivo .env en Backend

Crear archivo `.env` en la carpeta `backend/`:

```env
# Azure Cognitive Services - Speech
AZURE_SPEECH_KEY=tu_clave_speech_service
AZURE_REGION=westus2

# Azure Cognitive Services - Translator
AZURE_TRANSLATOR_KEY=tu_clave_translator
AZURE_TRANSLATOR_ENDPOINT=https://api.cognitive.microsofttranslator.com
```

**¿Dónde obtener las claves?**

1. **Azure Portal** → Servicios cognitivos
2. **Speech Service**: Ir a "Keys and Endpoint" → Copiar Key 1
3. **Translator Service**: Ir a "Keys and Endpoint" → Copiar Key 1 y Endpoint

### 5. Actualizar Configuración de Frontend (si es necesario)

Asegurar que el frontend apunte al backend correcto. Editar `frontend/src/modules/api.js`:

```javascript
const API_BASE_URL = "http://localhost:3000/api"; // Ajustar puerto según necesidad
```

---

## 🚀 Uso

### Ejecutar en Desarrollo

**Terminal 1 - Backend**:

```bash
cd backend
npm run dev
# Servidor corriendo en http://localhost:3000
```

**Terminal 2 - Frontend**:

```bash
cd frontend
npm run dev
# Aplicación disponible en http://localhost:5173
```

### Flujo de Uso Típico

1. **Abrir la aplicación** en `http://localhost:5173`
2. **Seleccionar idioma destino** del dropdown (lado derecho)
3. **Hacer clic en el botón de micrófono** para iniciar grabación
4. **Hablar en español** durante la grabación
5. **Hacer clic nuevamente** para detener grabación
6. **Esperar procesamiento**:
   - Conversión de audio a texto
   - Traducción a idioma destino
   - Síntesis de voz (TTS)
7. **Ver resultados**:
   - Transcripción en área izquierda
   - Traducción en área derecha
8. **Reproducir o descargar**:
   - Click en botón de play para escuchar traducción
   - Click en download para guardar WAV grabado

---

## 📁 Estructura del Proyecto

```
azure-voice-translator/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── config/
│   │   │   └── azure.config.js
│   │   ├── controllers/
│   │   │   ├── flow.controller.js
│   │   │   ├── speech.controller.js
│   │   │   ├── textToSpeech.controller.js
│   │   │   └── translate.controller.js
│   │   ├── routes/
│   │   │   ├── flow.routes.js
│   │   │   ├── speech.routes.js
│   │   │   ├── textToSpeech.routes.js
│   │   │   └── translate.routes.js
│   │   └── services/
│   │       ├── flow.service.js
│   │       ├── speech.service.js
│   │       └── translator.service.js
│   ├── uploads/                    # Archivos de audio temporales
│   ├── package.json
│   └── .env                        # Variables de entorno (crear)
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── main.js
│   │   ├── style.css
│   │   ├── index.html
│   │   ├── modules/
│   │   │   ├── api.js
│   │   │   ├── audio.js
│   │   │   ├── recording.js
│   │   │   ├── state.js
│   │   │   └── ui.js
│   │   └── assets/
│   ├── package.json
│   └── vite.config.js
│
├── README.md                       # Este archivo
└── package.json                    # Raíz del proyecto
```

---

## 🔐 Variables de Entorno

### Backend (.env)

| Variable                    | Descripción                       | Ejemplo                                         |
| --------------------------- | --------------------------------- | ----------------------------------------------- |
| `AZURE_SPEECH_KEY`          | Clave API del servicio Speech     | `a1b2c3d4e5f6...`                               |
| `AZURE_REGION`              | Región del servicio Speech        | `westus2`                                       |
| `AZURE_TRANSLATOR_KEY`      | Clave API del servicio Translator | `x1y2z3w4v5u6...`                               |
| `AZURE_TRANSLATOR_ENDPOINT` | URL del servicio Translator       | `https://api.cognitive.microsofttranslator.com` |

---

## 🔌 API Endpoints

### Speech to Text

```
POST /api/speech
Content-Type: multipart/form-data

Body:
  - audio: <archivo WAV>

Response:
  {
    "text": "texto reconocido"
  }
```

### Traducción

```
POST /api/translate
Content-Type: application/json

Body:
  {
    "text": "texto a traducir",
    "targetLanguage": "en"
  }

Response:
  {
    "translatedText": "translated text"
  }
```

### Text to Speech

```
POST /api/text-to-speech
Content-Type: application/json

Body:
  {
    "text": "texto a convertir a voz",
    "language": "en"
  }

Response:
  {
    "audioData": "<base64 encoded audio>"
  }
```

### Flujo Completo

```
POST /api/full-flow
Content-Type: multipart/form-data

Body:
  - audio: <archivo WAV>
  - targetLanguage: "en"

Response:
  {
    "originalText": "texto reconocido",
    "translatedText": "translated text",
    "audioData": "<base64 encoded audio>"
  }
```

---

## 🛠️ Tecnologías Utilizadas

### Backend

- **Express.js 5.2.1**: Framework web ligero y flexible
- **Microsoft Cognitive Services Speech SDK 1.49.0**: Reconocimiento y síntesis de voz
- **Axios 1.15.0**: Cliente HTTP moderno
- **Multer 2.1.1**: Middleware para carga de archivos
- **CORS 2.8.6**: Control de origen cruzado
- **dotenv 17.4.1**: Gestión de variables de entorno

### Frontend

- **Vite 5.0.12**: Build tool ultrarrápido y dev server
- **JavaScript ES6+**: JavaScript moderno con módulos
- **Web Audio API**: Captura y procesamiento de audio
- **CSS3**: Estilos modernos y responsivos

### Azure Services

- **Azure Speech Service**: Reconocimiento y síntesis de voz
- **Azure Translator Service**: Traducción automática multiidioma

---

## 📝 Notas Importantes

- Los archivos de audio se almacenan temporalmente en `backend/uploads/`
- El idioma de entrada está fijo en español mexicano (es-MX)
- Asegurarse de tener conexión a internet para acceder a servicios de Azure
- Las claves de Azure deben mantenerse privadas (nunca commitear .env)
- El backend debe estar ejecutándose antes de usar el frontend
- La aplicación requiere permiso del navegador para acceder al micrófono

---

## 🤝 Soporte y Mantenimiento

Para reportar problemas o sugerencias:

1. Verificar la consola del navegador (F12) para errores frontend
2. Verificar los logs del servidor backend
3. Validar que las claves de Azure sean correctas
4. Asegurar que los servicios Azure están activos

---

## 📄 Licencia

ISC

---

**Última actualización**: Abril 2026"

# 📱 WhatsApp Web Clone — TP Final Frontend

<div align="center">

![WhatsApp Clone Banner](https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg)

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**Clon funcional de WhatsApp Web con IA integrada, sistema de temas y 50 contactos de deportistas famosos.**

[🌐 Ver Demo en Vivo](#) · [📂 Repositorio GitHub](#) · [🐛 Reportar Bug](#)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción del Proyecto](#-descripción-del-proyecto)
- [Demo y Screenshots](#-demo-y-screenshots)
- [Funcionalidades](#-funcionalidades)
- [Tecnologías y Librerías](#-tecnologías-y-librerías)
- [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
- [Cumplimiento de Requisitos](#-cumplimiento-de-requisitos)
- [Instalación y Uso](#-instalación-y-uso)
- [Dificultades y Soluciones](#-dificultades-y-soluciones)
- [Autor](#-autor)

---

## 🎯 Descripción del Proyecto

**WhatsApp Web Clone** es una aplicación web que replica la experiencia visual y funcional de WhatsApp Web, construida íntegramente en **React** con una arquitectura moderna basada en componentes, contextos y enrutamiento dinámico.

El proyecto presenta **50 contactos de deportistas famosos** (Messi, Ronaldo, LeBron James, Hamilton, entre otros) con los que el usuario puede chatear en tiempo real gracias a la integración de la **API de Groq** (LLM Llama 3.3 70B), donde cada deportista responde con su personalidad y en voseo rioplatense.

### 🏆 Highlights del proyecto

| Feature | Detalle |
|---|---|
| 💬 Chat con IA | Respuestas generadas por Llama 3.3 70B vía Groq API |
| 🎨 Sistema de Temas | 5 presets + modo claro/oscuro con variables CSS |
| 📹 Estados con Video | 7 deportistas con clips de YouTube reproducibles |
| 🔔 Badges de No Leídos | Contador dinámico, ordenamiento automático |
| ✅ Ticks de Mensajes | Gris (enviado) → Azul (leído por el contacto) |
| 📱 Totalmente Responsivo | Desde 320px hasta 2000px |
| ♿ Accesibilidad | Paleta oficial de WhatsApp, contraste WCAG AA |

---

## 🖼 Demo y Screenshots

### Pantalla de Login
> El usuario ingresa su nombre antes de acceder a la aplicación. Es el único formulario de la app y dispara la inicialización del contexto global.

```
┌─────────────────────────────────────┐
│                                     │
│        🟢  WhatsApp                 │
│                                     │
│   ┌─────────────────────────────┐   │
│   │  Ingresá tu nombre...       │   │
│   └─────────────────────────────┘   │
│                                     │
│         [ Ingresar ]                │
│                                     │
└─────────────────────────────────────┘
```

### Vista Principal — Chat
> Sidebar con lista de contactos ordenada (no leídos primero), chat window con bubbles, ticks y footer con input de mensaje.

```
┌──────┬──────────────────┬───────────────────────────────┐
│ Nav  │   Contactos      │        Chat Window            │
│ Rail │                  │                               │
│  🗨  │ 🟢 Lionel Messi  │  ┌─────────────────────────┐ │
│  👁  │   Hace 2 min  🔴3│  │ Hola Leo! ¿Cómo andás?  │ │
│  📢  │ 🟢 L. Hamilton   │  └─────────────────────────┘ │
│  👥  │   Hace 5 min  🔴1│    ┌───────────────────────┐  │
│      │ ─────────────── │    │ Todo bien! Jugando al  │  │
│  🖼  │    Ronaldo       │    │ fulbo como el Diego ✓✓ │  │
│  ⚙️  │    Ayer          │    └───────────────────────┘  │
│  👤  │    LeBron James  │                               │
│      │    Ayer          │  ┌──────────────────────────┐ │
│      │    ...           │  │ ✏️ Escribir mensaje...  📤│ │
│      │                  │  └──────────────────────────┘ │
└──────┴──────────────────┴───────────────────────────────┘
```

### Estados con Video
> Panel lateral que muestra 7 deportistas con video reproducible (Messi, Bolt, Ginóbili, Ronaldo, LeBron, Wembanyama, Hamilton) y 4 en "Vistos".

```
┌─────────────────────────┐
│  ✕  Estados             │
│                         │       ┌──────────────────┐
│  RECIENTES              │  →    │  ████████████████│
│  🟢 Lionel Messi     ▶  │  clic │  ██  Messi  ✕ ██│
│  🟢 Usain Bolt       ▶  │  en ▶ │  ████ video ████│
│  🟢 Emanuel Ginóbili ▶  │       │  ████████████████│
│  🟢 Cristiano Ronaldo▶  │       └──────────────────┘
│  🟢 LeBron James     ▶  │
│  🟢 Victor Wembanyama▶  │
│  🟢 Lewis Hamilton   ▶  │
│                         │
│  VISTOS                 │
│  ⬜ Rafael Nadal        │
│  ⬜ Simone Biles        │
│  ⬜ Tiger Woods         │
│  ⬜ Stephen Curry       │
└─────────────────────────┘
```

### Sistema de Temas
> Panel de Ajustes con 5 presets de color (Dark, Light, Midnight Blue, Forest Green, Sunset Orange) y toggle Claro/Oscuro.

---

## ⚙️ Funcionalidades

### 🔐 Login y Sesión
- Formulario de ingreso de nombre de usuario
- Validación de campo vacío con feedback visual
- Persistencia del nombre en el contexto global (`ChatContext`)
- Pantalla de carga animada con doodles de fondo antes de entrar al chat

### 💬 Sistema de Chat
- **50 contactos** de deportistas famosos con avatares reales de Wikipedia/ESPN
- **Respuestas con IA**: integración con la API de Groq (`llama-3.3-70b-versatile`), cada deportista responde en personaje con voseo rioplatense
- **Respuestas de fallback** offline cuando la API no está disponible
- **Ticks de estado**: ✓ gris al enviar → ✓✓ azul cuando el contacto "responde"
- Timestamps en cada mensaje
- Scroll automático al último mensaje

### 🔔 Sistema de No Leídos
- Badge rojo con contador por contacto (valores 1, 2 o 3)
- Los primeros 25 contactos aparecen como leídos, los 25 restantes con badge
- **Ordenamiento dinámico**: no leídos siempre al tope de la lista
- Badge desaparece al abrir el chat (`markAsRead`)

### 🗂 Navegación y Panels
La barra de navegación lateral (NavRail) da acceso a:

| Icono | Panel | Descripción |
|-------|-------|-------------|
| 🗨 | **Chats** | Lista de contactos con búsqueda y filtros |
| 👁 | **Estados** | Historias con video de 7 deportistas |
| 📢 | **Canales** | Lista de canales deportivos con botón Seguir/Siguiendo |
| 👥 | **Comunidades** | Panel hero con CTA |
| 🖼 | **Multimedia** | Acceso a contenido multimedia |
| ⚙️ | **Ajustes** | Configuración + selector de tema |
| 👤 | **Perfil** | Edición de nombre e info |

### 🎨 Sistema de Temas
- **5 presets**: Dark (default), Light, Midnight Blue, Forest Green, Sunset Orange
- Toggle global Claro ↔ Oscuro dentro de cada preset
- Variables CSS dinámicas aplicadas vía `ThemeContext` y `setProperty`
- Doodles de fondo que cambian según el tema (claro/oscuro)
- Paleta oficial de WhatsApp Web pixel-perfect

### 📹 Estados con Video
- 7 deportistas con clips de YouTube en autoplay
- **Barra de progreso** animada (30 segundos, cierra automáticamente)
- Overlay con avatar, nombre y botón de cierre
- Click fuera del video cierra el overlay
- 4 contactos en sección "Vistos" (sin video, anillo gris)

### 🔍 Filtros de Contactos
- Chips: **Todos / No leídos / Favoritos / Grupos / +**
- Panel "Favoritos" con estado vacío
- Panel "+" con opciones: Nuevo grupo, Nueva difusión, Chat cifrado, Encuesta
- Menú de tres puntos con opciones de WhatsApp

### 📱 Responsividad
- Layout adaptable de **320px a 2000px**
- En mobile: sidebar ocupa el ancho completo, chat window se muestra al seleccionar contacto
- Scrollbars personalizados con variables de tema
- NavRail colapsable en pantallas pequeñas

---

## 🛠 Tecnologías y Librerías

### Core
| Librería | Versión | Uso |
|----------|---------|-----|
| **React** | 18.x | Framework principal, componentes, hooks |
| **Vite** | 5.x | Bundler y dev server ultrarrápido |
| **React Router DOM** | 6.x | Enrutamiento SPA, parámetros de URL |

### UI y Estilos
| Librería | Uso |
|----------|-----|
| **Lucide React** | Iconografía: Search, X, MessageSquarePlus, EllipsisVertical |
| **CSS Variables** | Sistema de temas dinámico sin ninguna librería de CSS-in-JS |
| **CSS Modules** | Aislamiento de estilos por componente |

### API e IA
| Servicio | Uso |
|----------|-----|
| **Groq API** | Inferencia LLM (Llama 3.3 70B Versatile) — 14.400 req/día gratis |
| **YouTube Embed** | Videos de estados de los deportistas |

### Despliegue
| Herramienta | Uso |
|-------------|-----|
| **Vercel** | Hosting con CI/CD automático desde GitHub |
| **GitHub** | Control de versiones y entrega del proyecto |

---

## 🏗 Arquitectura del Proyecto

```
src/
├── components/
│   └── conmon/              # Componentes compartidos (iconos SVG)
│       ├── ChatIcon.jsx
│       ├── ChannelIcon.jsx
│       ├── StatusIcon.jsx
│       ├── ComunityIcon.jsx
│       ├── MultimediaIcon.jsx
│       └── SettingsIcon.jsx
│
├── context/
│   ├── ChatContext.jsx      # Estado global: mensajes, usuario, no leídos, IA
│   └── ThemeContext.jsx     # Temas: presets, modo claro/oscuro, apply()
│
├── data/
│   └── contactsData.jsx     # 50 deportistas con id, nombre, avatar, bio, conexión
│
├── features/
│   ├── theme/
│   │   └── ThemePanel.jsx   # Selector de presets y toggle claro/oscuro
│   └── backup/
│       └── BackupPanel.jsx  # Panel de backup (decorativo)
│
├── pages/
│   ├── LoginPage.jsx        # Formulario de ingreso — Página 1
│   ├── LoadingScreen.jsx    # Pantalla de carga animada
│   └── ChatPage.jsx         # Layout principal del chat — Página 2
│
├── features/
│   ├── Sidebar.jsx          # NavRail + lista de contactos + todos los panels
│   ├── ChatWindow.jsx       # Ventana de chat con mensajes y footer
│   └── StatusScreen.jsx     # Panel de estados con video overlay
│
├── styles/
│   ├── index.css            # Variables CSS globales (colores, temas)
│   ├── App.css
│   ├── Sidebar.css
│   ├── ChatWindow.css
│   └── StatusScreen.css
│
└── App.jsx                  # Router principal con rutas protegidas
```

### Flujo de Rutas

```
/                   →  LoginPage (formulario de nombre)
/loading            →  LoadingScreen (animación 3s)
/chat               →  ChatPage (bienvenida / sin contacto)
/chat/:id_usuario   →  ChatPage (chat activo con parámetro de ruta)
```

---

## ✅ Cumplimiento de Requisitos

| Requisito | Estado | Detalle |
|-----------|--------|---------|
| Despliegue en Vercel | ✅ | CI/CD automático desde rama `main` |
| Código en GitHub | ✅ | Repositorio público con commits descriptivos |
| README.md | ✅ | Este documento |
| Responsivo 320px–2000px | ✅ | CSS Grid + Flexbox + media queries |
| Estilos accesibles | ✅ | Contraste WCAG AA, paleta oficial WhatsApp |
| Desarrollado en React | ✅ | React 18 con hooks modernos |
| Uso de estados | ✅ | `useState` en todos los componentes interactivos |
| Uso de contextos | ✅ | `ChatContext` (mensajes, IA, no leídos) + `ThemeContext` (temas) |
| React Router DOM | ✅ | Rutas: `/`, `/loading`, `/chat`, `/chat/:id_usuario` |
| Al menos 1 formulario | ✅ | LoginPage con validación y submit |
| Uso de componentes | ✅ | +15 componentes reutilizables |
| Al menos 2 páginas | ✅ | LoginPage, LoadingScreen, ChatPage |
| Parámetros de ruta | ✅ | `useParams()` en ChatPage para `id_usuario` |
| Principios DRY/YAGNI/KISS | ✅ | Helpers centralizados, sin código duplicado |

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/whatsapp-clone.git
cd whatsapp-clone

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir en el navegador
# http://localhost:5173
```

### Build para producción

```bash
npm run build
npm run preview
```

### Variables de entorno (opcional)

Si querés usar tu propia API key de Groq:

```bash
# .env
VITE_GROQ_API_KEY=gsk_tu_api_key_aqui
```

---

## 🧩 Decisiones de Diseño

### ¿Por qué Groq en lugar de OpenAI o Gemini?

Durante el desarrollo se probaron múltiples APIs:

- **Gemini Flash**: límite de **20 requests/día** en el tier gratuito — inviable para demo
- **OpenAI**: requiere tarjeta de crédito desde el primer uso
- **Groq**: **14.400 requests/día** gratis, latencia < 500ms, compatible con formato OpenAI

### ¿Por qué IDs numéricos en lugar de nombres como claves?

Los nombres de algunos deportistas tienen caracteres especiales (`ó`, `é`) que generan inconsistencias entre el encoding del archivo fuente y el string literal en JavaScript. Usar `id_usuario` como clave elimina completamente el problema.

### ¿Por qué CSS Variables en lugar de una librería de temas?

- **Cero dependencias extra**: el sistema de temas funciona con CSS nativo
- **Performance**: el navegador resuelve las variables sin re-renders de React
- **Flexibilidad**: cualquier propiedad CSS puede usar variables sin wrapper de componente

---

## 😓 Dificultades y Soluciones

### 1. Encoding de caracteres especiales en keys de objetos
**Problema**: `Emanuel Ginóbili` en el array de contactos no matcheaba con la key del objeto de videos.  
**Solución**: Migrar todo el sistema de identificación a `id_usuario` (strings numéricos como `"049"`).

### 2. Límites de la API de Gemini
**Problema**: 20 requests/día hacían inviable las pruebas continuas.  
**Solución**: Migración completa a Groq API con el modelo `llama-3.3-70b-versatile`.

### 3. Doodles del chat no cambiaban con el tema
**Problema**: `ChatWindow.css` tenía hardcodeada la URL de la imagen oscura.  
**Solución**: Cambiar a `background-image: var(--wa-doodles)` y definir la variable en cada preset del `ThemeContext`.

### 4. Badges de no leídos no desaparecían al abrir el chat
**Problema**: El estado de `unreadCounts` no se actualizaba al navegar.  
**Solución**: `useEffect` en `ChatWindow` que llama a `markAsRead(id)` al montar el componente.

### 5. Ordenamiento dinámico de contactos
**Problema**: Los contactos con badge aparecían mezclados aleatoriamente.  
**Solución**: `useMemo` que ordena por `unreadCounts[id]` descendente, con re-cálculo automático al cambiar los contadores.

### 6. Videos de YouTube en el overlay de estados
**Problema**: Los iframes de YouTube bloqueaban el click del overlay para cerrar.  
**Solución**: `stopPropagation()` en el contenedor del video + botón ✕ explícito.

---

## 👤 Autor

**[Tu Nombre]**  
Estudiante de Frontend — Comisión [XX]

[![GitHub](https://img.shields.io/badge/GitHub-tu--usuario-181717?style=flat-square&logo=github)](https://github.com/tu-usuario)

---

<div align="center">

**TP Final — Curso de Frontend**  
Hecho con ❤️ y mucho ☕

</div>

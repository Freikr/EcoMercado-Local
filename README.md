# 🌿 EcoMercado Local — Arquitectura Autónoma y Accesible

**EcoMercado Local** es una aplicación web interactiva diseñada para conectar a consumidores locales con productores agrícolas. Funciona bajo el modelo de una **Single Page Application (SPA)** nativa en el frontend y cuenta con un **servidor independiente (Backend)** con persistencia en un fichero plano local (`database.json`), garantizando portabilidad absoluta sin dependencias de bases de datos externas de terceros.

El proyecto ha sido optimizado estructuralmente bajo criterios de accesibilidad digital (**a11y**), eliminando barreras de interacción para lectores de pantalla.

---

## 🚀 Características Clave

- **SPA Nativa:** Transición instantánea entre la vista del Consumidor y del Productor mediante manipulación directa del DOM (sin recargas de página).
- **Persistencia Local Síncrona:** Base de datos interna autónoma que almacena dinámicamente tanto las cosechas registradas como la configuración del perfil del usuario.
- **Formularios 100% Accesibles:** Validación técnica según las pautas WCAG (vínculos explícitos mediante `id` y `for`, y placeholders semánticos estructurados).
- **Interfaz Fluida (Tailwind CSS):** Estilizado moderno y responsivo adaptado para su despliegue inmediato en dispositivos móviles y de escritorio.
- **Interacciones en Tiempo Real:** Buscador por texto, filtros inmediatos por categoría y contador del carrito de compras integrado.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5 Semántico, JavaScript Moderno (ES6+), Tailwind CSS (vía CDN para renderizado ágil).
- **Backend:** Node.js, Express.js (configurado con sintaxis moderna de ECMAScript Modules - `"type": "module"`), CORS.
- **Base de Datos:** Fichero JSON local administrado dinámicamente mediante el sistema de archivos nativo de Node (`fs`).

---

## 📁 Estructura del Proyecto

```text
📦 ecomercado-local
├── 📂 backend
│   ├── database.json          # Archivo plano autogenerado (Persistencia)
│   ├── package.json           # Dependencias y tipo de módulo del servidor
│   └── server.js              # Servidor Express y endpoints de la API
├── 📂 frontend
│   ├── Captura.js             # Gestión de lógica y envíos de formularios (API REST)
│   ├── index.html             # Interfaz de usuario estructurada y accesible
│   └── Render.js              # Controlador del DOM, filtros, buscador y carrito
└── .gitignore                 # Reglas de exclusión para Git (node_modules y base de datos)
```
---
## Video Mandatorio
https://drive.google.com/file/d/1amAFaqicp8na48x9Y5coWGQrprdKpSGh/view?usp=sharing

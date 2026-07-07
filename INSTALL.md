
# 🛠️ Guía Detallada de Instalación y Despliegue — EcoMercado Local

Esta guía contiene los requisitos previos, los pasos de configuración y la resolución de problemas comunes para poner en marcha el entorno local de **EcoMercado Local** tanto para el ecosistema de desarrollo como para su evaluación técnica.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu sistema operativo lo siguiente:
- **Node.js:** Versión 16.x o superior (Recomendado LTS). Puedes verificar tu versión ejecutando `node -v`.
- **NPM (Node Package Manager):** Incluido automáticamente con Node.js. Verifícalo con `npm -v`.
- **Navegador Web Moderno:** Google Chrome, Microsoft Edge, Mozilla Firefox o Brave (con herramientas de desarrollo activas).
- **Editor de Código:** Visual Studio Code (altamente recomendado).

---

## 🚀 Pasos para la Instalación

### Paso 1: Clonar el Repositorio
Abre tu terminal favorita (Git Bash, CMD, Terminal de Mac/Linux) y clona el proyecto a tu máquina local:
```bash
git clone [https://github.com/Freikr/EcoMercado-Local.git](gh repo clone Freikr/EcoMercado-Local)
cd ecomercado-local

Paso 2: Configuración del Servidor de Persistencia (Backend)
El backend requiere la instalación de módulos específicos para gestionar el servidor HTTP local y permitir las peticiones del frontend.

Navega directamente a la carpeta del backend:

Bash
cd backend
Instala las dependencias necesarias (express y cors):

Bash
npm install
Nota: Si estás configurando desde cero y no cuentas con un package.json previo, ejecuta primero npm init -y y luego npm install express cors. Asegúrate de que el archivo package.json incluya la propiedad "type": "module" para dar soporte a la sintaxis moderna de importaciones.

Inicia el servicio:

Bash
node server.js
Si todo está configurado correctamente, verás en la consola las siguientes líneas de confirmación:

Plaintext
🚀 Servidor Autónomo con Perfil en http://localhost:3000
📁 Base de datos interna activa en: .../backend/database.json
⚠️ IMPORTANTE: Mantén esta ventana de la terminal abierta. Si la cierras, el servidor se apagará y el frontend no podrá guardar ni leer productos.

Paso 3: Lanzamiento del Entorno Visual (Frontend)
Dado que la aplicación está diseñada como una Single Page Application (SPA) nativa con JavaScript, no requiere procesos de compilación pesados.

Abre una nueva ventana de tu terminal o una nueva pestaña (sin cerrar la del servidor) y regresa a la raíz o entra a la carpeta del frontend:

Bash
cd ../frontend
Para una experiencia de desarrollo óptima, abre la carpeta global en Visual Studio Code.

Inicia la interfaz:

Opción recomendada: Haz clic derecho sobre el archivo index.html y selecciona "Open with Live Server" (requiere la extensión instalada en VS Code). Esto desplegará la app en http://127.0.0.1:5500.

Opción directa: Haz doble clic sobre el archivo index.html para abrirlo directamente en el navegador desde el sistema de archivos (file:///...). Nota: Se recomienda el uso de un servidor local como Live Server para evitar bloqueos estrictos de políticas de seguridad del navegador en peticiones asíncronas avanzadas.

🧪 Verificación del Despliegue
Para confirmar que el sistema completo está integrado y cooperando al 100%:

Abre la aplicación en el navegador.

Ve a la carpeta backend/ en tu editor de código y verifica que se haya autogenerado un archivo llamado database.json con la estructura inicial de perfil.

En la interfaz web, cambia a la "Vista Productor", abre el modal "Añadir Cosecha", llena los campos obligatorios y presiona guardar.

Si la inyección es inmediata y visualizas el nuevo producto en las tarjetas sin parpadeos ni recargas en la pestaña, tu instalación ha sido un éxito rotundo.

🔍 Resolución de Problemas Comunes (Troubleshooting)
1. Error: ERR_MODULE_NOT_FOUND o Cannot find module 'express'
Causa: No has instalado las dependencias en la carpeta correcta o falta la carpeta node_modules/.

Solución: Ve a la terminal, asegúrate de estar dentro de ecomercado-local/backend y ejecuta estrictamente npm install express cors. Reinicia el servidor con node server.js.

2. Error: Cannot use import statement outside a module
Causa: Node.js está intentando ejecutar el servidor con la sintaxis vieja de módulos comunes.

Solución: Abre tu archivo backend/package.json y asegúrate de añadir la propiedad "type": "module" en el primer nivel del objeto JSON.

3. Error de Red / No se cargan los productos en la pantalla
Causa: El servidor de Node.js está apagado o hay un bloqueo de seguridad en el navegador.

Solución: Comprueba que la terminal del backend siga encendida y activa en el puerto 3000. Si utilizas extensiones que bloqueen scripts o rastreadores, desactívalas temporalmente para localhost.

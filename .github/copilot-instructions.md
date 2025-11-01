# Copilot Instructions for AI Agents

## Overview
Este proyecto es un sistema de monitoreo de visitas web con dashboard y API REST, desplegado en Vercel y usando Node.js, React, y PostgreSQL. El objetivo es rastrear visitas, mostrar estadísticas y facilitar la integración en cualquier sitio web mediante un tracker JS.

## Arquitectura
- **Frontend** (`src/`): React + Vite + TailwindCSS. Componentes principales: `App.jsx`, `Home.jsx`, `View.jsx`.
- **Backend/API** (`api/`): Funciones serverless en Node.js para recolectar y consultar visitas. El archivo clave es `collect.js`.
- **Base de datos**: PostgreSQL, tabla principal `visits`.
- **Tracker** (`public/tracker.js`): Script JS que envía datos de visita usando sendBeacon/fetch.
- **Configuración CORS**: Dominios permitidos en `api/collect.js` (modificar `allowedOrigins` para nuevos dominios).
- **Deployment**: Vercel, con configuración en `vercel.json`.

## Flujos de trabajo
- **Instalación local**: `npm install` y `npm run dev`. Requiere archivo `.env.local` con `DATABASE_URL`.
- **Despliegue**: Push a `main` activa deploy automático en Vercel.
- **Agregar dominio**: Editar `allowedOrigins` en `api/collect.js` y desplegar.
- **Integración tracker**: Incluir `<script src="https://toolting.vercel.app/tracker.js"></script>` en el sitio web.
- **Debugging**: Logs mejorados en frontend y backend. Modo debug automático en localhost.

## Convenciones y patrones
- **API REST**: Endpoints en `/api/collect` (GET para últimas visitas, POST para registrar visita).
- **CORS**: Headers configurados manualmente en `api/collect.js`.
- **Manejo de errores**: Mensajes descriptivos y logs detallados.
- **Eventos tracker**: Usa `beforeunload`, `pagehide`, `visibilitychange` para maximizar captura.
- **Modo debug**: Tracker activa debug en localhost.
- **Frontend**: Componentes React organizados por página. Estilos en `styles.css`.

## Ejemplos clave
- **Agregar dominio permitido**:
  ```js
  // api/collect.js
  const allowedOrigins = [
    'https://jawuil.dev',
    'https://tu-nuevo-dominio.com',
    // ...
  ];
  ```
- **Tabla visitas**:
  ```sql
  CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    duration_seconds INTEGER NOT NULL,
    visit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  ```

## Integraciones y dependencias
- **Vercel**: Serverless deployment y variables de entorno.
- **PostgreSQL**: Conexión vía `DATABASE_URL`.
- **TailwindCSS**: Estilos en frontend.

## Archivos clave
- `api/collect.js`: Lógica principal de API y CORS.
- `public/tracker.js`: Script de rastreo JS.
- `src/View.jsx`: Dashboard de visualización.
- `vercel.json`: Configuración de deployment.
- `.env.local`: Variables de entorno (no versionar).

## Contribuciones
- Fork, rama feature, PR a main. Ver README para detalles.

---
¿Falta algún flujo, convención o integración importante? Indica detalles para mejorar estas instrucciones.
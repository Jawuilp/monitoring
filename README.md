# Sistema de Monitoreo Analytics

## 📊 Descripción
Sistema de analytics personal para rastrear visitas en sitios web, con dashboard de visualización y API REST.

## 🚀 Características
- Rastreo automático de visitas con duración
- Detección de IP del visitante
- Dashboard para visualizar estadísticas
- API REST con soporte CORS
- Tracker JavaScript ligero y eficiente

## 🛠️ Tecnologías
- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Vercel Functions
- **Base de datos**: PostgreSQL
- **Deployment**: Vercel

## 📦 Instalación

### Requisitos previos
- Node.js 22.x
- PostgreSQL
- Cuenta en Vercel (para deployment)

### Instalación local
```bash
# Clonar el repositorio
git clone [tu-repo]

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env.local con:
DATABASE_URL=tu_connection_string_postgresql

# Ejecutar en desarrollo
npm run dev
```

## 🔧 Configuración

### Base de datos PostgreSQL
Crear la tabla necesaria:
```sql
CREATE TABLE visits (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    duration_seconds INTEGER NOT NULL,
    visit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Configuración CORS
La API ya está configurada para permitir solicitudes desde:
- https://jawuil.dev
- https://toolting.vercel.app
- http://localhost:5173
- http://localhost:3000

Para agregar más dominios, edita el archivo `api/collect.js`:
```javascript
const allowedOrigins = [
    'https://jawuil.dev',
    'https://tu-nuevo-dominio.com',
    // ... más dominios
];
```

## 📝 Uso

### Instalación del Tracker
Agrega este script en el `<head>` o antes del cierre de `</body>` en tu sitio web:

```html
<script src="https://toolting.vercel.app/tracker.js"></script>
```

### API Endpoints

#### GET /api/collect
Obtiene las últimas 50 visitas registradas.

**Respuesta:**
```json
[
  {
    "url": "https://ejemplo.com",
    "ip_address": "192.168.1.1",
    "duration_seconds": 45,
    "date": "2024-01-01T12:00:00Z"
  }
]
```

#### POST /api/collect
Registra una nueva visita.

**Body:**
```json
{
  "url": "https://ejemplo.com",
  "ip": "192.168.1.1",
  "duration": 45
}
```

## 🐛 Solución de Problemas

### Error CORS
**Problema**: "El servidor no permite solicitudes desde este dominio"

**Solución**: 
1. Verifica que tu dominio esté en la lista de `allowedOrigins` en `api/collect.js`
2. Asegúrate de desplegar los cambios a Vercel
3. Limpia el caché del navegador

### sendBeacon no funciona
**Problema**: Los datos no se envían al cerrar la página

**Solución**: 
El tracker ahora incluye un fallback automático a `fetch()` cuando `sendBeacon` falla. También se utiliza:
- `beforeunload` event
- `pagehide` event  
- `visibilitychange` event

Para maximizar la captura de datos.

### Error de conexión a base de datos
**Problema**: "Error al insertar en la base de datos"

**Solución**:
1. Verifica que `DATABASE_URL` esté correctamente configurado en Vercel
2. Asegúrate que la tabla `visits` existe
3. Verifica los permisos de la base de datos

## 📊 Dashboard

### Página Principal (/)
Muestra:
- Script de instalación para copiar
- Últimas 10 visitas registradas

### Página de Visualización (/view)
Muestra:
- Tabla agrupada por URL con contador de visitas
- Verificador de estado de sitios web
- Estadísticas detalladas

## 🚀 Deployment en Vercel

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno:
   - `DATABASE_URL`: Connection string de PostgreSQL
3. Deploy automático con cada push a main

## 📄 Licencia
MIT

## 🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 💡 Mejoras Implementadas Recientes

### ✅ CORS Configurado
- Headers CORS agregados en `api/collect.js`
- Configuración adicional en `vercel.json`
- Soporte para múltiples orígenes incluido https://jawuil.dev

### ✅ Manejo Mejorado de sendBeacon
- La API ahora parsea correctamente el JSON enviado por sendBeacon
- Fallback automático a fetch() cuando sendBeacon falla
- Uso de Blob con Content-Type correcto

### ✅ Mejor Manejo de Errores
- Mensajes de error más descriptivos en el frontend
- Detección específica de errores CORS
- Logs mejorados para debugging

### ✅ Tracker Optimizado
- Múltiples eventos para capturar datos (beforeunload, pagehide, visibilitychange)
- Modo debug automático en localhost
- Mejor resilencia ante fallos de red

## 📞 Soporte
Para problemas o preguntas, abre un issue en el repositorio.
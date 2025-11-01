class SimpleTracker {
  constructor() {
      this.startTime = new Date();
      this.endpoint = 'https://toolting.vercel.app/api/event';
      this.debug = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      this.trackVisit();
  }

  async trackVisit() {
      // La IP se obtendrá en el backend desde los headers (x-forwarded-for)

      // Función para enviar datos
      const sendData = async () => {
          const duration = (new Date() - this.startTime) / 1000;
          const data = {
              url: window.location.href,
              duration: Math.round(duration)
          };
          
          if (this.debug) {
              console.log('Enviando datos:', data);
          }
          
          // Intentar con sendBeacon primero (más eficiente para beforeunload)
          if (navigator.sendBeacon) {
              try {
                  // sendBeacon envía como texto plano, no como JSON con Content-Type correcto
                  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
                  const success = navigator.sendBeacon(this.endpoint, blob);
                  
                  if (success) {
                      if (this.debug) console.log('✓ Datos enviados con sendBeacon');
                      return;
                  } else {
                      if (this.debug) console.warn('sendBeacon retornó false, intentando con fetch...');
                  }
              } catch (error) {
                  if (this.debug) console.error('Error con sendBeacon:', error);
              }
          }
          
          // Fallback a fetch si sendBeacon falla o no está disponible
          try {
              const response = await fetch(this.endpoint, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(data),
                  // keepalive permite que la petición continúe aunque se cierre la página
                  keepalive: true
              });
              
              if (response.ok) {
                  if (this.debug) console.log('✓ Datos enviados con fetch');
              } else {
                  const error = await response.text();
                  console.error('Error del servidor:', response.status, error);
              }
          } catch (error) {
              console.error('Error al enviar datos:', error);
              // Si hay error de CORS, mostrar información útil
              if (error.message && error.message.includes('CORS')) {
                  console.error('Error CORS: Asegúrate que el dominio', window.location.origin, 'está permitido en la API');
              }
          }
      };

      // Enviar datos cada 10 segundos
      const intervalId = setInterval(sendData, 10000);

      // Enviar datos finales y limpiar intervalo al cerrar la pestaña
      window.addEventListener('beforeunload', () => {
          if (this.debug) console.log('Página cerrándose, enviando datos finales');
          clearInterval(intervalId); // Detener el intervalo
          sendData(); // Enviar datos finales (sendBeacon funcionará mejor aquí)
      });
      
      // También enviar datos cuando el usuario navega a otra página (SPA)
      window.addEventListener('pagehide', () => {
          sendData();
      });
      
      // Enviar datos cuando la página pierde visibilidad
      document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'hidden') {
              sendData();
          }
      });
  }
}

// Inicializar tracker
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.__tracker = new SimpleTracker();
        });
    } else {
        window.__tracker = new SimpleTracker();
    }
    console.log('Analytics tracker cargado desde:', window.location.origin);
}

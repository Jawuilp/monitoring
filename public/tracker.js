// Script de monitoreo para el frontend 
class SimpleTracker {
  constructor() {
      this.startTime = new Date();
      this.endpoint = '/api/collect';
      this.trackVisit();
  }

  async trackVisit() {
      // Detectar IP
      let ip = 'unknown';
      try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          ip = data.ip;
          console.log('IP obtenida:', ip);
      } catch (error) {
          console.error('Error al obtener IP:', error);
      }

      // Registrar datos al cerrar la pestaña
      window.addEventListener('beforeunload', () => {
          const duration = (new Date() - this.startTime) / 1000;
          const data = {
              url: window.location.href,
              ip,
              duration: Math.round(duration)
          };
          console.log('Enviando datos:', data);
          try {
              navigator.sendBeacon(this.endpoint, JSON.stringify(data));
          } catch (error) {
              console.error('Error enviando datos:', error);
          }
      });
  }
}

// Iniciar el tracker
console.log('Tracker iniciado');
new SimpleTracker();
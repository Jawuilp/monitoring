class SimpleTracker {
  constructor() {
      this.startTime = new Date();
      this.endpoint = '/api/collect'; // Cambia a la URL completa si el servidor está en otro dominio, ej: 'https://tu-api.com/api/collect'
      this.trackVisit();
  }

  async trackVisit() {
      let ip = 'unknown';
      try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          ip = data.ip;
          console.log('IP obtenida:', ip);
      } catch (error) {
          console.error('Error al obtener IP:', error);
      }

      // Función para enviar datos
      const sendData = () => {
          const duration = (new Date() - this.startTime) / 1000;
          const data = {
              url: window.location.href,
              ip,
              duration: Math.round(duration)
          };
          console.log('Enviando datos:', data);
          try {
              const success = navigator.sendBeacon(this.endpoint, JSON.stringify(data));
              if (!success) {
                  console.error('navigator.sendBeacon falló, posible problema con el navegador o endpoint');
              } else {
                  console.log('Datos enviados con éxito vía sendBeacon');
              }
          } catch (error) {
              console.error('Error al enviar datos con sendBeacon:', error);
          }
      };

      // Enviar datos cada 10 segundos
      const intervalId = setInterval(sendData, 10000);

      // Enviar datos finales y limpiar intervalo al cerrar la pestaña
      window.addEventListener('beforeunload', () => {
          console.log('Página cerrándose, enviando datos finales');
          clearInterval(intervalId); // Detener el intervalo
          sendData(); // Enviar datos finales
      });
  }
}

console.log('Tracker iniciado');
new SimpleTracker();
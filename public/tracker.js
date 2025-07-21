// Script de monitoreo para el frontend 
class SimpleTracker {
    constructor() {
      this.startTime = new Date();
      this.endpoint = 'https://tudominio.vercel.app/api/collect';
      this.trackVisit();
    }
  
    async trackVisit() {
      // Detectar IP (método simplificado)
      const ip = await fetch('https://api.ipify.org?format=json')
        .then(res => res.json())
        .then(data => data.ip)
        .catch(() => 'unknown');
  
      // Calcular duración al cerrar la pestaña
      window.addEventListener('beforeunload', () => {
        const duration = (new Date() - this.startTime) / 1000; // segundos
        
        fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: window.location.href,
            ip,
            duration: Math.round(duration)
          })
        });
      });
    }
  }
  
  // Inicia automáticamente
  new SimpleTracker();
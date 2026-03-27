import { renderLayout } from './components/layout.js';
import { navigate, initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');

  // Cargar estructura base
  app.innerHTML = renderLayout();

  // Activar router
  initRouter();

  // Primera vista
  navigate('movimientos');
});

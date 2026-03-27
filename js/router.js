const routes = {
  movimientos: async () => {
    const module = await import('./views/movimientos.js');
    return module.default();
  },
  inventario: async () => {
    const module = await import('./views/inventario.js');
    return module.default();
  },
  produccion: async () => {
    const module = await import('./views/produccion.js');
    return module.default();
  },
  dashboard: async () => {
    const module = await import('./views/dashboard.js');
    return module.default();
  }
};

export function initRouter() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-route]');
    if (!btn) return;

    const route = btn.dataset.route;
    await navigate(route);
  });
}

export async function navigate(route) {
  const viewContainer = document.getElementById('view');
  if (!viewContainer) return;

  if (!routes[route]) {
    viewContainer.innerHTML = '<div class="screen"><h2>Vista no encontrada</h2></div>';
    return;
  }

  viewContainer.innerHTML = '<div class="screen"><div class="screen-body"><p>Cargando...</p></div></div>';

  try {
    const html = await routes[route]();
    viewContainer.innerHTML = html;
    setActiveMenu(route);
  } catch (error) {
    console.error('Error cargando vista:', route, error);
    viewContainer.innerHTML = '<div class="screen"><div class="screen-body"><h2>Error cargando la vista</h2></div></div>';
  }
}

function setActiveMenu(route) {
  document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
}

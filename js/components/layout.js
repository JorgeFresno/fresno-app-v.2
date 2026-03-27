export function renderLayout() {
  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">EL FRESNO</div>

        <nav class="menu">
          <button class="menu-btn active" data-route="movimientos">Movimientos</button>
          <button class="menu-btn" data-route="inventario">Inventario</button>
          <button class="menu-btn" data-route="produccion">Producción</button>
          <button class="menu-btn" data-route="dashboard">Dashboard</button>
        </nav>
      </aside>

      <main class="main-content">
        <div id="view" class="view-container"></div>
      </main>
    </div>
  `;
}

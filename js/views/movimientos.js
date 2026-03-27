import { API_URL } from '../config.js';

export default function () {
  setTimeout(loadMovimientos, 0);

  return `
    <section class="screen">
      <div class="screen-header">
        <h1>Movimientos</h1>
      </div>

      <div class="screen-body">
        <div id="movimientos-list">
          <div class="loading-state">Cargando movimientos...</div>
        </div>
      </div>
    </section>
  `;
}

async function loadMovimientos() {
  const container = document.getElementById('movimientos-list');
  if (!container) return;

  try {
    const response = await fetch(API_URL + '?accion=getMovimientos&_=' + Date.now());
    const json = await response.json();

    const rows = Array.isArray(json.data) ? json.data : [];

    if (!rows.length) {
      container.innerHTML = `<div class="empty-state">Sin movimientos</div>`;
      return;
    }

    container.innerHTML = rows.map(renderMovimiento).join('');

  } catch (e) {
    container.innerHTML = `<div class="empty-state">Error cargando movimientos</div>`;
  }
}

function renderMovimiento(m) {
  const entrada = (m.TipoMov || '').toLowerCase().includes('entrada');

  const icon = entrada ? '⬇️' : '⬆️';
  const qtyClass = entrada ? 'positive' : 'negative';

  const cantidad =
    m.CantidadPz ? `${m.CantidadPz} pz` :
    m.CantidadKg ? `${m.CantidadKg} kg` : '';

  return `
    <div class="mov-item">
      <div class="mov-icon-wrap">${icon}</div>

      <div class="mov-body">
        <div class="mov-folio">${m.FolioMov || ''}</div>
        <div class="mov-detail">${m.Descripcion || m.ClaveProducto || ''}</div>
      </div>

      <div class="mov-amount">
        <div class="mov-qty ${qtyClass}">${cantidad}</div>
        <div class="mov-time">${formatear(m.FechaMov)}</div>
      </div>
    </div>
  `;
}

function formatear(f) {
  if (!f) return '';
  const d = new Date(f);
  if (isNaN(d)) return f;

  return d.toLocaleString('es-MX', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

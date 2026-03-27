import { API_URL } from '../config.js';

export default function () {
  setTimeout(loadMovimientos, 0);

  return `
    <section class="screen">
      <div class="screen-header">
        <h1>Movimientos</h1>
      </div>

      <div class="screen-body">
        <div id="movimientos-list"></div>
      </div>
    </section>
  `;
}

async function loadMovimientos() {
  const container = document.getElementById('movimientos-list');
  if (!container) return;

  container.innerHTML = `<div class="loading-state">Cargando movimientos...</div>`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: JSON.stringify({ accion: 'getMovimientos' })
    });

    const data = await response.json();
    const rows = data?.data || [];

    if (!rows.length) {
      container.innerHTML = `<div class="empty-state">Sin movimientos</div>`;
      return;
    }

    container.innerHTML = rows.map(renderMovimiento).join('');

  } catch (err) {
    container.innerHTML = `<div class="empty-state">Error cargando movimientos</div>`;
  }
}

function renderMovimiento(mov) {
  const tipo = mov.TipoMov || '';
  const folio = mov.FolioMov || '';
  const desc = mov.Descripcion || mov.ClaveProducto || '';
  const fecha = mov.FechaMov || '';
  const pz = Number(mov.CantidadPz || 0);
  const kg = Number(mov.CantidadKg || 0);
  const estado = mov.Estado || '';

  const isEntrada = tipo.toLowerCase().includes('entrada');

  const icon = isEntrada ? '⬇️' : '⬆️';
  const qtyClass = isEntrada ? 'positive' : 'negative';

  const cantidad = pz
    ? `${pz} pz`
    : kg
    ? `${kg} kg`
    : '';

  return `
    <div class="mov-item">
      <div class="mov-icon-wrap">${icon}</div>

      <div class="mov-body">
        <div class="mov-folio">${folio}</div>
        <div class="mov-detail ${estado === 'Cancelado' ? 'cancelled' : ''}">
          ${desc}
        </div>
      </div>

      <div class="mov-amount">
        <div class="mov-qty ${qtyClass}">
          ${cantidad}
        </div>
        <div class="mov-time">${formatearFecha(fecha)}</div>
      </div>
    </div>
  `;
}

function formatearFecha(fecha) {
  if (!fecha) return '';

  try {
    const d = new Date(fecha);
    return d.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return fecha;
  }
}

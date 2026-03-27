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
          <div class="loading-state">
            <div class="loading-spinner"></div>
            Cargando movimientos...
          </div>
        </div>
      </div>
    </section>
  `;
}

async function loadMovimientos() {
  const container = document.getElementById('movimientos-list');
  if (!container) return;

  try {
    const url = `${API_URL}?accion=getMovimientos&_=${Date.now()}`;

    const response = await fetch(url, {
      method: 'GET',
      cache: 'no-store'
    });

    const payload = await response.json();
    const rows = Array.isArray(payload?.data) ? payload.data : [];

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
  const tipo = String(mov.TipoMov || '').trim();
  const folio = String(mov.FolioMov || '').trim();
  const desc = String(mov.Descripcion || mov.ClaveProducto || '').trim();
  const estado = String(mov.Estado || '').trim();
  const fecha = mov.FechaMov || '';
  const pz = Number(mov.CantidadPz || 0);
  const kg = Number(mov.CantidadKg || 0);

  const esEntrada = tipo.toLowerCase().includes('entrada');
  const esCancelado = estado === 'Cancelado';

  const icono = esEntrada ? '⬇️' : '⬆️';
  const qtyClass = esEntrada ? 'positive' : 'negative';

  let cantidad = '';
  if (pz && kg) cantidad = `${pz} pz · ${kg} kg`;
  else if (pz) cantidad = `${pz} pz`;
  else if (kg) cantidad = `${kg} kg`;

  return `
    <div class="mov-item">
      <div class="mov-icon-wrap">${icono}</div>

      <div class="mov-body">
        <div class="mov-folio">${escapeHtml(folio || 'Sin folio')}</div>
        <div class="mov-detail ${esCancelado ? 'cancelled' : ''}">
          ${escapeHtml(desc || tipo || 'Sin descripción')}
        </div>
      </div>

      <div class="mov-amount">
        <div class="mov-qty ${qtyClass}">
          ${escapeHtml(cantidad)}
        </div>
        <div class="mov-time">${escapeHtml(formatearFecha(fecha))}</div>
      </div>
    </div>
  `;
}

function formatearFecha(fecha) {
  if (!fecha) return '';
  try {
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return String(fecha);
    return d.toLocaleString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return String(fecha);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

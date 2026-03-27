import { API_URL } from '../config.js';

export default function () {
  setTimeout(loadMovimientos, 0);

  return `
    <section class="screen">
      <div class="screen-header">
        <h1>Movimientos</h1>
      </div>

      <div class="screen-body">
        <div class="card">
          <div id="movimientos-status">Cargando datos reales...</div>
          <div id="movimientos-output" style="margin-top:16px;"></div>
        </div>
      </div>
    </section>
  `;
}

async function loadMovimientos() {
  const statusEl = document.getElementById('movimientos-status');
  const outputEl = document.getElementById('movimientos-output');

  if (!statusEl || !outputEl) return;

  try {
    const response = await fetch(API_URL, {
  method: 'POST',
  body: JSON.stringify({
    accion: 'getMovimientos'
  })
});
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      statusEl.innerHTML = 'La respuesta no vino como JSON válido.';
      outputEl.innerHTML = `
        <pre style="white-space:pre-wrap;overflow:auto;">${escapeHtml(text)}</pre>
      `;
      return;
    }

    statusEl.innerHTML = 'Conexión exitosa con Apps Script.';

    const rows = normalizeRows(data);

    if (!rows.length) {
      outputEl.innerHTML = `
        <div>No llegaron filas utilizables.</div>
        <pre style="white-space:pre-wrap;overflow:auto;margin-top:16px;">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
      `;
      return;
    }

    outputEl.innerHTML = renderTable(rows);
  } catch (error) {
    statusEl.innerHTML = 'Error al consultar Apps Script.';
    outputEl.innerHTML = `
      <pre style="white-space:pre-wrap;overflow:auto;">${escapeHtml(error.message || String(error))}</pre>
    `;
  }
}

function normalizeRows(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.movimientos)) return data.movimientos;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

function renderTable(rows) {
  const safeRows = rows.slice(0, 50);

  if (typeof safeRows[0] !== 'object' || safeRows[0] === null || Array.isArray(safeRows[0])) {
    return `
      <pre style="white-space:pre-wrap;overflow:auto;">${escapeHtml(JSON.stringify(safeRows, null, 2))}</pre>
    `;
  }

  const columns = Object.keys(safeRows[0]);

  return `
    <div style="overflow:auto;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr>
            ${columns.map(col => `
              <th style="text-align:left;padding:10px;border-bottom:1px solid #ddd;background:#f7f7f7;position:sticky;top:0;">
                ${escapeHtml(col)}
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${safeRows.map(row => `
            <tr>
              ${columns.map(col => `
                <td style="padding:10px;border-bottom:1px solid #eee;vertical-align:top;">
                  ${escapeHtml(formatValue(row[col]))}
                </td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function formatValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

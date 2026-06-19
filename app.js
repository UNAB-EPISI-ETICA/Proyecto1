// Datos Iniciales del negocio simulado
let products = [
    { id: 1, name: "Leche Gloria Grande", price: 4.50, cost: 3.20, stock: 24 },
    { id: 2, name: "Arroz Costeño 1kg", price: 5.00, cost: 3.80, stock: 15 },
    { id: 3, name: "Aceite Primor 1L", price: 11.50, cost: 8.90, stock: 3 },
    { id: 4, name: "Gaseosa Coca-Cola 1.5L", price: 6.00, cost: 4.50, stock: 0 },
    { id: 5, name: "Detergente Opal 800g", price: 8.50, cost: 6.20, stock: 8 },
    { id: 6, name: "Fideos Don Vittorio 500g", price: 3.20, cost: 2.10, stock: 0 },
    { id: 7, name: "Atún Real Campagnola", price: 6.50, cost: 4.80, stock: 19 }
];

let gananciaHoy = 142.50;
let salesHistory = [
    { text: "Hace 10 min - Arroz Costeño (x2) - Total: S/ 10.00", profit: 2.40 },
    { text: "Hace 35 min - Leche Gloria (x1) - Total: S/ 4.50", profit: 1.30 }
];

const historialGanancias = {
    2025: { total: "S/ 38,420", svg: `<svg viewBox="0 0 400 120" style="width:100%; height:auto;"><path d="M 10 100 Q 100 60, 200 40 T 390 20" fill="none" stroke="#10b981" stroke-width="3"/><circle cx="10" cy="100" r="4" fill="#10b981"/><circle cx="130" cy="75" r="4" fill="#10b981"/><circle cx="260" cy="35" r="4" fill="#10b981"/><circle cx="390" cy="20" r="4" fill="#10b981"/><text x="10" y="85" font-size="10" fill="#64748b">S/ 2.5k</text><text x="360" y="15" font-size="10" fill="#10b981" font-weight="bold">S/ 4.1k</text></svg>` },
    2024: { total: "S/ 29,150", svg: `<svg viewBox="0 0 400 120" style="width:100%; height:auto;"><path d="M 10 110 Q 100 90, 200 70 T 390 50" fill="none" stroke="#3b82f6" stroke-width="3"/><circle cx="10" cy="110" r="4" fill="#3b82f6"/><circle cx="130" cy="95" r="4" fill="#3b82f6"/><circle cx="260" cy="65" r="4" fill="#3b82f6"/><circle cx="390" cy="50" r="4" fill="#3b82f6"/><text x="10" y="95" font-size="10" fill="#64748b">S/ 1.8k</text><text x="360" y="45" font-size="10" fill="#3b82f6" font-weight="bold">S/ 2.9k</text></svg>` }
};

// --- NAVEGACIÓN ENTRE SECCIONES INTERNAS (SPA) ---
function switchSection(sectionId) {
    // Quitar la clase activa de todas las secciones y botones
    document.querySelectorAll('.app-section').forEach(section => section.classList.remove('active-section'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    // Activar la sección y botón correspondiente
    document.getElementById(`section-${sectionId}`).classList.add('active-section');
    document.getElementById(`nav-${sectionId}`).classList.add('active');
}

function updateUI() {
    let disponibles = 0; let bajo = 0; let agotados = 0;

    const posGrid = document.getElementById('pos-products');
    const invTable = document.getElementById('inventory-table');
    
    posGrid.innerHTML = '';
    invTable.innerHTML = '';

    products.forEach(p => {
        let statusClass = 'green';
        let statusText = 'Saludable';

        if (p.stock === 0) {
            agotados++;
            statusClass = 'red';
            statusText = 'Agotado';
        } else if (p.stock <= 5) {
            bajo++;
            statusClass = 'yellow';
            statusText = 'Stock Bajo';
            disponibles++;
        } else {
            disponibles++;
        }

        // Render POS
        const posEl = document.createElement('div');
        posEl.className = `pos-item ${p.stock === 0 ? 'out-of-stock' : ''}`;
        posEl.onclick = () => registerSale(p.id);
        posEl.innerHTML = `
            <div class="pos-name">${p.name}</div>
            <div class="pos-price">S/ ${p.price.toFixed(2)}</div>
            <div class="pos-stock">Stock: ${p.stock}</div>
        `;
        posGrid.appendChild(posEl);

        // Render Tabla
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight:600;">${p.name}</td>
            <td style="color:#10b981; font-weight:600;">S/ ${p.price.toFixed(2)}</td>
            <td style="color:#64748b;">S/ ${p.cost.toFixed(2)}</td>
            <td><strong>${p.stock} u.</strong></td>
            <td><span class="status-pill ${statusClass}">${statusText}</span></td>
        `;
        invTable.appendChild(row);
    });

    document.getElementById('count-disponibles').innerText = disponibles;
    document.getElementById('count-bajo').innerText = bajo;
    document.getElementById('count-agotados').innerText = agotados;
    document.getElementById('kpi-ganancia').innerText = `S/ ${gananciaHoy.toFixed(2)}`;

    const salesBox = document.getElementById('recent-sales');
    salesBox.innerHTML = '';
    salesHistory.forEach(s => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<span>${s.text}</span> <strong style="color:#10b981;">+S/ ${s.profit.toFixed(2)}</strong>`;
        salesBox.appendChild(div);
    });
}

function registerSale(productId) {
    const prod = products.find(p => p.id === productId);
    if (!prod || prod.stock <= 0) return;

    prod.stock--;
    let profit = prod.price - prod.cost;
    gananciaHoy += profit;

    salesHistory.unshift({
        text: `Justo ahora - ${prod.name} (x1) - Total: S/ ${prod.price.toFixed(2)}`,
        profit: profit
    });

    updateUI();
}

function switchYear(year) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${year}`).classList.add('active');
    
    document.getElementById('chart-box').innerHTML = 
        historialGanancias[year].svg + 
        `<div style="text-align:right; font-weight:bold; font-size:14px; margin-top:5px; color:#1e293b;">Total Año: ${historialGanancias[year].total}</div>`;
}

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
    switchYear(2025);
});
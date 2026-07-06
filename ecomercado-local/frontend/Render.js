const API_URL = 'http://localhost:3000/api';

let todosLosProductos = []; 
let categoriaActiva = 'Vegetales';
let filtroCercaniaActivo = false;
let totalCarrito = 0;
let perfilUsuario = {};

// Selectores del DOM
const gridConsumidor = document.getElementById('grid-productos-frescos');
const listaProductor = document.getElementById('lista-inventario-productor');
const badgeActivos = document.getElementById('badge-activos');
const inputBuscar = document.getElementById('input-buscar');
const cartCounter = document.getElementById('cart-counter');
const btnCercaMi = document.getElementById('btn-cerca-mi');

/* ================= CONTROL DE PERFIL ================= */
async function cargarPerfil() {
    try {
        const res = await fetch(`${API_URL}/profile`);
        perfilUsuario = await res.json();
        
        // Renderizar en UI del banner
        document.getElementById('profile-banner-name').innerText = perfilUsuario.name;
        document.getElementById('profile-banner-location').innerText = `📍 ${perfilUsuario.location}`;
        document.getElementById('profile-banner-avatar').src = perfilUsuario.avatarUrl;
        
        // Rellenar campos del formulario modal
        document.getElementById('edit-profile-name').value = perfilUsuario.name;
        document.getElementById('edit-profile-location').value = perfilUsuario.location;
        document.getElementById('edit-profile-avatar').value = perfilUsuario.avatarUrl;
    } catch (err) {
        console.error("Error cargando perfil interno");
    }
}

// Envío del Formulario de Perfil
document.getElementById('form-actualizar-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const datosModificados = {
        name: document.getElementById('edit-profile-name').value.trim(),
        location: document.getElementById('edit-profile-location').value.trim(),
        avatarUrl: document.getElementById('edit-profile-avatar').value.trim()
    };

    try {
        const res = await fetch(`${API_URL}/profile`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosModificados)
        });
        if (res.ok) {
            document.getElementById('modal-perfil').classList.add('hidden');
            cargarPerfil(); // Refresca los campos en toda la app
        }
    } catch (err) {
        console.error(err);
    }
});

/* ================= FLUJO DE PRODUCTOS Y FILTROS ================= */
async function actualizarSistemas() {
    try {
        const response = await fetch(`${API_URL}/products`);
        todosLosProductos = await response.json();
        filtrarYRenderizar();
    } catch (error) {
        const errHTML = `<p class="text-red-500 text-xs text-center py-6 col-span-2">⚠️ Error de conexión con la base de datos interna.</p>`;
        gridConsumidor.innerHTML = errHTML;
        listaProductor.innerHTML = errHTML;
    }
}

function filtrarYRenderizar() {
    const textoBusqueda = inputBuscar.value.toLowerCase().trim();

    // Filtro combinado Consumidor
    const productosFiltrados = todosLosProductos.filter(p => {
        const coincideCategoria = p.category === categoriaActiva;
        const coincideBusqueda = p.name.toLowerCase().includes(textoBusqueda);
        
        // Simulación "Cerca de mí": Evalúa si coincide con la ubicación actual del perfil guardado
        const coincideCercania = !filtroCercaniaActivo || p.producer.toLowerCase() === perfilUsuario.name.toLowerCase();
        
        return coincideCategoria && coincideBusqueda && coincideCercania && p.active;
    });

    const productosProductor = todosLosProductos.filter(p => p.name.toLowerCase().includes(textoBusqueda));

    renderizarConsumidor(productosFiltrados);
    renderizarProductor(productosProductor);
}

function renderizarConsumidor(productos) {
    if (productos.length === 0) {
        gridConsumidor.innerHTML = '<p class="text-slate-400 text-sm py-8 col-span-2 text-center">No hay productos disponibles bajo estos criterios de filtro.</p>';
        return;
    }
    gridConsumidor.innerHTML = productos.map(prod => `
        <div class="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col group">
            <div class="w-full h-48 overflow-hidden bg-slate-50 relative">
                <img src="${prod.imageUrl}" alt="${prod.name}" class="w-full h-full object-cover">
                <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-slate-700 px-2 py-1 rounded-lg shadow-sm">👤 ${prod.producer}</span>
            </div>
            <div class="p-5 flex justify-between items-end">
                <div>
                    <h4 class="font-bold text-slate-900 text-base">${prod.name}</h4>
                    <div class="text-[#2d7a54] font-black text-lg mt-1">RD$ ${prod.price}</div>
                    <p class="text-xs text-slate-400 font-medium">por ${prod.unit}</p>
                </div>
                <!-- Funcionalidad del Botón + Vinculada -->
                <button onclick="agregarAlCarrito()" class="bg-[#2d7a54] text-white w-9 h-9 rounded-full flex justify-center items-center font-bold text-lg hover:bg-emerald-800 transition shadow-sm">+</button>
            </div>
        </div>
    `).join('');
}

function renderizarProductor(productos) {
    const activos = productos.filter(p => p.active).length;
    badgeActivos.innerText = `${activos} activos`;

    if (productos.length === 0) {
        listaProductor.innerHTML = '<p class="text-slate-400 text-sm py-4 text-center">No hay productos en el inventario.</p>';
        return;
    }

    listaProductor.innerHTML = productos.map(prod => `
        <div class="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex justify-between items-center">
            <div class="flex items-center gap-4">
                <img src="${prod.imageUrl}" alt="${prod.name}" class="w-12 h-12 object-cover rounded-lg bg-slate-50">
                <div>
                    <h4 class="font-bold text-slate-900 text-sm">${prod.name}</h4>
                    <p class="text-xs text-slate-400 mt-0.5">RD$ ${prod.price} / ${prod.unit}</p>
                    <span class="text-[11px] font-bold px-2 py-0.5 rounded-full inline-block mt-1 ${prod.active ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-100'}">
                        ${prod.active ? 'Disponible' : 'No disponible'}
                    </span>
                </div>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" ${prod.active ? 'checked' : ''} onchange="alternarDisponibilidad('${prod.id}')" class="sr-only peer">
                <div class="w-9 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2d7a54]"></div>
            </label>
        </div>
    `).join('');
}

/* ================= FUNCIONALIDADES ADICIONALES DE BOTONES ================= */

// 1. Contador del Carrito (+)
window.agregarAlCarrito = () => {
    totalCarrito++;
    cartCounter.innerText = totalCarrito;
    // Animación rápida de feedback
    cartCounter.classList.add('scale-125', 'text-emerald-600');
    setTimeout(() => cartCounter.classList.remove('scale-125', 'text-emerald-600'), 200);
};

// 2. Filtro Geográfico "Cerca de mí"
btnCercaMi.addEventListener('click', () => {
    filtroCercaniaActivo = !filtroCercaniaActivo;
    if (filtroCercaniaActivo) {
        btnCercaMi.className = "bg-emerald-50 border border-emerald-300 text-[#2d7a54] px-5 py-2 rounded-xl font-bold shadow-sm flex items-center gap-1 transition";
    } else {
        btnCercaMi.className = "bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-xl font-medium hover:bg-slate-50 transition flex items-center gap-1";
    }
    filtrarYRenderizar();
});

// 3. Selector de Idioma Cosmético (ES / EN)
const langEs = document.getElementById('lang-es');
const langEn = document.getElementById('lang-en');

function conmutarIdioma(activo, inactivo) {
    activo.className = "cursor-pointer bg-white/10 text-emerald-400 px-2 py-0.5 rounded transition";
    inactivo.className = "cursor-pointer text-emerald-200/60 px-2 py-0.5 transition hover:text-white";
}
langEs.addEventListener('click', () => conmutarIdioma(langEs, langEn));
langEn.addEventListener('click', () => conmutarIdioma(langEn, langEs));

// 4. Conmutadores de Visibilidad de Modales de Perfil
document.getElementById('btn-abrir-perfil').addEventListener('click', () => document.getElementById('modal-perfil').classList.remove('hidden'));
document.getElementById('btn-cerrar-perfil').addEventListener('click', () => document.getElementById('modal-perfil').classList.add('hidden'));

// Lógica de Toggles y Vistas Preexistentes
window.alternarDisponibilidad = async (id) => {
    try {
        await fetch(`${API_URL}/products/${id}/toggle`, { method: 'PATCH' });
        actualizarSistemas();
    } catch (err) { console.error(err); }

    // Agrega esto al final del try{} en la función cargarPerfil() de Render.js:
if (document.getElementById('input-producer')) {
    document.getElementById('input-producer').value = perfilUsuario.name;
}
};

inputBuscar.addEventListener('input', filtrarYRenderizar);

document.querySelectorAll('.btn-categoria').forEach(boton => {
    boton.addEventListener('click', (e) => {
        document.querySelectorAll('.btn-categoria').forEach(b => {
            b.className = "btn-categoria bg-white border border-slate-200 text-slate-600 px-5 py-2 rounded-xl font-medium hover:bg-slate-50 transition";
        });
        e.target.className = "btn-categoria bg-[#2d7a54] text-white px-5 py-2 rounded-xl font-medium shadow-sm";
        categoriaActiva = e.target.id.replace('cat-', '');
        filtrarYRenderizar();
    });
});

// Cambios de pantallas cosméticas
document.getElementById('btn-ir-productor').addEventListener('click', () => {
    document.getElementById('vista-consumidor').classList.add('hidden');
    document.getElementById('vista-productor').classList.remove('hidden');
});
document.getElementById('btn-ir-consumidor').addEventListener('click', () => {
    document.getElementById('vista-productor').classList.add('hidden');
    document.getElementById('vista-consumidor').classList.remove('hidden');
});
const modalCosecha = document.getElementById('modal-cosecha');
document.getElementById('btn-abrir-modal').addEventListener('click', () => modalCosecha.classList.remove('hidden'));
document.getElementById('btn-cerrar-modal').addEventListener('click', () => modalCosecha.classList.add('hidden'));

// Carga Inicial Doble
document.addEventListener('DOMContentLoaded', () => {
    cargarPerfil();
    actualizarSistemas();
});
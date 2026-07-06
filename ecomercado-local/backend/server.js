import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'database.json');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Estructura inicial unificada (Perfil autónomo + Catálogo)
const ESTRUCTURA_INICIAL = {
    profile: {
        name: "María González",
        location: "San Cristóbal",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
    },
    products: []
};

// Crea la base de datos interna local con formato JSON si no existe al arrancar
if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(ESTRUCTURA_INICIAL, null, 2));
}

// Helpers de lectura/escritura nativa en el archivo del sistema
const leerBD = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const escribirBD = (datos) => fs.writeFileSync(DB_PATH, JSON.stringify(datos, null, 2));

/* ================= ENDPOINTS DE PERFIL ================= */

// GET: Obtener datos actuales del perfil
app.get('/api/profile', (req, res) => {
    try {
        const bd = leerBD();
        res.json(bd.profile);
    } catch (error) {
        res.status(500).json({ message: 'Error al leer el perfil de la base de datos interna' });
    }
});

// PUT: Modificar o actualizar campos del perfil comercial
app.put('/api/profile', (req, res) => {
    try {
        const bd = leerBD();
        const { name, location, avatarUrl } = req.body;
        
        bd.profile = { name, location, avatarUrl };
        escribirBD(bd);
        res.json(bd.profile);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el perfil en la base de datos interna' });
    }
});

/* ================= ENDPOINTS DE PRODUCTOS ================= */

// GET: Obtener todo el catálogo de productos
app.get('/api/products', (req, res) => {
    try {
        const bd = leerBD();
        res.json(bd.products);
    } catch (error) {
        res.status(500).json({ message: 'Error al leer los productos de la base de datos interna' });
    }
});

// POST: Registrar un nuevo producto ecológico en la colección local
app.post('/api/products', (req, res) => {
    try {
        const { name, description, price, unit, producer, imageUrl, category } = req.body;
        const bd = leerBD();

        const nuevoProducto = {
            id: Date.now().toString(), // ID único basado en timestamp nativo
            name,
            description,
            price: parseFloat(price),
            unit,
            producer,
            imageUrl,
            category: category || 'Vegetales',
            active: true // Disponible por defecto al crearse
        };

        bd.products.push(nuevoProducto);
        escribirBD(bd);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(400).json({ message: 'Error al escribir el producto en el almacenamiento local' });
    }
});

// PATCH: Alternar disponibilidad (Soporte directo para el interruptor toggle de la UI)
app.patch('/api/products/:id/toggle', (req, res) => {
    try {
        const { id } = req.params;
        const bd = leerBD();
        const producto = bd.products.find(p => p.id === id);

        if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });

        producto.active = !producto.active; // Invierte el estado booleano
        escribirBD(bd);
        res.json(producto);
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar la disponibilidad en el archivo local' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor Autónomo con Perfil en http://localhost:${PORT}`);
    console.log(`📁 Base de datos interna activa en: ${DB_PATH}`);
});
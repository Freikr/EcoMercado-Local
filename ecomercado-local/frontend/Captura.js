// Referencias de Cosechas
const FORM_PUBLICAR = document.getElementById('form-publicar-producto');
const MODAL_COSECHA = document.getElementById('modal-cosecha');

// Referencias de Perfil
const FORM_PERFIL = document.getElementById('form-actualizar-perfil');
const MODAL_PERFIL = document.getElementById('modal-perfil');

/* ============================================================
   1. CONTROLADOR: REGISTRO DE NUEVAS COSECHAS
   ============================================================ */
if (FORM_PUBLICAR) {
    FORM_PUBLICAR.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nuevoProducto = {
            name: document.getElementById('input-name').value.trim(),
            price: parseFloat(document.getElementById('input-price').value),
            unit: document.getElementById('input-unit').value.trim(),
            producer: document.getElementById('input-producer').value.trim(),
            category: document.getElementById('input-category').value,
            imageUrl: document.getElementById('input-imageUrl').value.trim() || 'https://images.unsplash.com/photo-1610348725531-843dff14692a?w=500',
            description: document.getElementById('input-description').value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProducto)
            });

            if (response.ok) {
                FORM_PUBLICAR.reset();
                if (MODAL_COSECHA) MODAL_COSECHA.classList.add('hidden');

                // Forzar re-renderizado inmediato del catálogo en la UI sin recargar
                if (typeof actualizarSistemas === 'function') {
                    actualizarSistemas();
                }
            } else {
                const errorData = await response.json();
                alert(`⚠️ Error en la base de datos interna: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error de red al registrar el producto:', error);
            alert('No se pudo conectar con el servidor. Verifica que esté corriendo en el puerto 3000.');
        }
    });
}

/* ============================================================
   2. CONTROLADOR: ACTUALIZACIÓN INTERNA DE PERFIL
   ============================================================ */
if (FORM_PERFIL) {
    FORM_PERFIL.addEventListener('submit', async (e) => {
        e.preventDefault();

        const perfilActualizado = {
            name: document.getElementById('edit-profile-name').value.trim(),
            location: document.getElementById('edit-profile-location').value.trim(),
            avatarUrl: document.getElementById('edit-profile-avatar').value.trim()
        };

        try {
            const response = await fetch('http://localhost:3000/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(perfilActualizado)
            });

            if (response.ok) {
                if (MODAL_PERFIL) MODAL_PERFIL.classList.add('hidden');

                // Llama la función de Render.js para refrescar dinámicamente los banners
                if (typeof cargarPerfil === 'function') {
                    await cargarPerfil();
                }
                
                // Actualizar automáticamente el campo del productor en el formulario de cosechas
                const inputProducer = document.getElementById('input-producer');
                if (inputProducer) {
                    inputProducer.value = perfilActualizado.name;
                }
            } else {
                alert('⚠️ No se pudieron guardar los cambios de perfil en el archivo local.');
            }
        } catch (error) {
            console.error('Error de red al actualizar el perfil:', error);
            alert('Error de conexión con el backend independiente.');
        }
    });
}
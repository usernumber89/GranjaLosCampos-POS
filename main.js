// ========================================
// INICIALIZACIÓN Y UTILIDADES PRINCIPALES - main.js
// ========================================

// Inicialización de la aplicación
async function initApp() {
    try {
        // Inicializar Firebase
        await initDB();

        // Inicializar autenticación
        initAuth();

        // Configurar valores por defecto en formularios
        document.getElementById('loteFecha').valueAsDate = new Date();
        document.getElementById('salidaFecha').valueAsDate = new Date();
        document.getElementById('ventaCantidad').value = '0';

        console.log('Aplicación inicializada correctamente');

    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        alert('Error al iniciar la aplicación. Recargue la página.');
    }
}

// ========================================
// FUNCIONES DE UTILIDADES
// ========================================

function switchTab(event, tabName) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(tabName).classList.add('active');

    if (tabName === 'database') {
        actualizarEstadisticasDB();
    }
}

// ========================================
// FUNCIONES DE BACKUP Y RESTAURACIÓN
// ========================================

async function crearBackup() {
    try {
        const lotes = await obtenerTodos('lotes');
        const clientes = await obtenerTodos('clientes');
        const proveedores = await obtenerTodos('proveedores');
        const ventas = await obtenerTodos('ventas');
        const salidas = await obtenerTodos('salidas');

        const backup = {
            fecha: new Date().toISOString(),
            version: '1.0',
            datos: {
                lotes,
                clientes,
                proveedores,
                ventas,
                salidas
            }
        };

        const dataStr = JSON.stringify(backup, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `backup_granja_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        mostrarAlerta('Backup creado exitosamente', 'success');
    } catch (error) {
        console.error('Error al crear backup:', error);
        mostrarAlerta('Error al crear el backup', 'error');
    }
}

function restaurarBackup(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const backup = JSON.parse(e.target.result);

            // Validar estructura del backup
            if (!backup.datos || !backup.datos.lotes || !backup.datos.clientes || !backup.datos.ventas) {
                throw new Error('Archivo de backup inválido');
            }

            if (!confirm('⚠️ Esta acción reemplazará todos los datos actuales. ¿Desea continuar?')) {
                return;
            }

            // Limpiar stores
            await limpiarStore('lotes');
            await limpiarStore('clientes');
            await limpiarStore('proveedores');
            await limpiarStore('ventas');
            await limpiarStore('salidas');

            // Restaurar datos
            for (const lote of backup.datos.lotes) {
                await agregarRegistro('lotes', lote);
            }
            for (const cliente of backup.datos.clientes) {
                await agregarRegistro('clientes', cliente);
            }
            if (backup.datos.proveedores) {
                for (const proveedor of backup.datos.proveedores) {
                    await agregarRegistro('proveedores', proveedor);
                }
            }
            for (const venta of backup.datos.ventas) {
                await agregarRegistro('ventas', venta);
            }
            if (backup.datos.salidas) {
                for (const salida of backup.datos.salidas) {
                    await agregarRegistro('salidas', salida);
                }
            }

            mostrarAlerta('Base de datos restaurada exitosamente', 'success');
            await actualizarUI();
        } catch (error) {
            console.error('Error al importar:', error);
            alert('Error al restaurar el backup. Verifique que el archivo sea válido.');
        }
    };
    reader.readAsText(file);
}

async function limpiarBaseDatos() {
    if (!confirm('⚠️ ¿ESTÁ SEGURO? Esta acción eliminará PERMANENTEMENTE todos los lotes, clientes, proveedores, ventas y salidas.')) {
        return;
    }

    if (!confirm('Esta es su última oportunidad. ¿Desea continuar?')) {
        return;
    }

    try {
        await limpiarStore('lotes');
        await limpiarStore('clientes');
        await limpiarStore('proveedores');
        await limpiarStore('ventas');
        await limpiarStore('salidas');

        carrito = [];

        mostrarAlerta('Base de datos limpiada completamente', 'success');
        await actualizarUI();
    } catch (error) {
        console.error('Error al limpiar:', error);
        mostrarAlerta('Error al limpiar la base de datos', 'error');
    }
}

// ========================================
// REGISTRO DE SERVICE WORKER
// ========================================

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log('Service Worker registrado'))
        .catch(err => console.error('SW error', err));
}

// ========================================
// INICIAR APLICACIÓN
// ========================================

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp);
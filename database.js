// ========================================
// SISTEMA DE BASE DE DATOS - database.js
// ========================================

// Variables globales de base de datos
let db = null;

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCTV-miHc-sA9-n1MJjQEfwQSfyNvl9vG0",
    authDomain: "granja-los-campos-pos.firebaseapp.com",
    projectId: "granja-los-campos-pos",
    storageBucket: "granja-los-campos-pos.firebasestorage.app",
    messagingSenderId: "553361614502",
    appId: "1:553361614502:web:8192471c4d88bfe3e9b667",
    measurementId: "G-7SL48RPRSF"
};

// Inicializar Firebase
function initDB() {
    return new Promise((resolve, reject) => {
        try {
            // Verificar si Firebase ya está inicializado
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }

            // Inicializar servicios
            db = firebase.firestore();

            console.log('Firebase inicializado correctamente');
            resolve({ db });
        } catch (error) {
            console.error('Error al inicializar Firebase:', error);
            document.getElementById('dbStatus').innerHTML = '<div class="db-indicator" style="background: red;"></div><span>Error de Conexión</span>';
            reject(error);
        }
    });
}

// Funciones CRUD genéricas para Firebase Firestore
function agregarRegistro(storeName, data) {
    return new Promise((resolve, reject) => {
        const docRef = db.collection(storeName).doc();
        data.id = docRef.id; // Firestore usa IDs de documento

        docRef.set(data)
            .then(() => {
                resolve(docRef.id);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function obtenerRegistro(storeName, id) {
    return new Promise((resolve, reject) => {
        db.collection(storeName).doc(id).get()
            .then((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    data.id = doc.id;
                    resolve(data);
                } else {
                    resolve(null);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function obtenerTodos(storeName) {
    return new Promise((resolve, reject) => {
        db.collection(storeName).get()
            .then((querySnapshot) => {
                const datos = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    datos.push(data);
                });
                resolve(datos);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function actualizarRegistro(storeName, data) {
    return new Promise((resolve, reject) => {
        const id = data.id;
        const dataCopy = { ...data };
        delete dataCopy.id;

        db.collection(storeName).doc(id).set(dataCopy)
            .then(() => {
                resolve(id);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function eliminarRegistro(storeName, id) {
    return new Promise((resolve, reject) => {
        db.collection(storeName).doc(id).delete()
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

function limpiarStore(storeName) {
    return new Promise((resolve, reject) => {
        // Obtener todos los documentos de la colección
        db.collection(storeName).get()
            .then((querySnapshot) => {
            const batch = db.batch();
            querySnapshot.forEach((doc) => {
                batch.delete(doc.ref);
            });
            return batch.commit();
        })
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

// ========================================
// GESTIÓN DE LOTES
// ========================================

async function agregarLote() {
    const numero = document.getElementById('loteNumero').value;
    const cantidad = parseInt(document.getElementById('loteCantidad').value);
    const peso = parseFloat(document.getElementById('lotePesoPromedio').value);
    const fecha = document.getElementById('loteFecha').value;
    const notas = document.getElementById('loteNotas').value;

    if (!numero || !cantidad || !peso || !fecha) {
        alert('Por favor complete todos los campos obligatorios');
        return;
    }

    const lote = {
        id: Date.now(),
        numero,
        cantidad,
        disponibles: cantidad,
        pesoPromedio: peso,
        fecha,
        notas,
        activo: true
    };

    try {
        await agregarRegistro('lotes', lote);

        // Limpiar formulario
        document.getElementById('loteNumero').value = '';
        document.getElementById('loteCantidad').value = '';
        document.getElementById('lotePesoPromedio').value = '';
        document.getElementById('loteFecha').value = '';
        document.getElementById('loteNotas').value = '';

        mostrarAlerta('Lote agregado exitosamente a la base de datos', 'success');
        await actualizarUI();
    } catch (error) {
        console.error('Error al agregar lote:', error);
        mostrarAlerta('Error al guardar el lote', 'error');
    }
}

async function eliminarLote(id) {
    if (confirm('¿Está seguro de eliminar este lote de la base de datos?')) {
        try {
            await eliminarRegistro('lotes', id);
            mostrarAlerta('Lote eliminado', 'success');
            await actualizarUI();
        } catch (error) {
            console.error('Error al eliminar lote:', error);
            mostrarAlerta('Error al eliminar el lote', 'error');
        }
    }
}

async function renderizarLotes() {
    const container = document.getElementById('listaLotes');
    const lotes = await obtenerTodos('lotes');

    // Actualizar select de salidas
    const selectSalida = document.getElementById('salidaLote');
    if (selectSalida) {
        selectSalida.innerHTML = '<option value="">Sin lote</option>';
        lotes.forEach(l => {
            selectSalida.innerHTML += `<option value="${l.id}">${l.numero}</option>`;
        });
    }

    if (lotes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay lotes en la base de datos</p>
            </div>
        `;
        return;
    }

    let html = '<table><thead><tr><th>Lote</th><th>Pollos</th><th>Peso Prom.</th><th>Fecha</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';

    lotes.forEach(lote => {
        html += `
            <tr>
                <td><strong>${lote.numero}</strong></td>
                <td>${lote.disponibles} / ${lote.cantidad}</td>
                <td>${lote.pesoPromedio} lbs</td>
                <td>${new Date(lote.fecha).toLocaleDateString()}</td>
                <td><span class="badge ${lote.activo ? 'badge-active' : 'badge-inactive'}">${lote.activo ? 'Activo' : 'Agotado'}</span></td>
                <td>
                    <button class="btn-outline action-btn" onclick="eliminarLote(${lote.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    // Actualizar select de ventas
    const select = document.getElementById('ventaLote');
    select.innerHTML = '<option value="">Seleccionar lote...</option>';
    lotes.filter(l => l.activo && l.disponibles > 0).forEach(lote => {
        select.innerHTML += `<option value="${lote.id}">${lote.numero} (${lote.disponibles} disponibles)</option>`;
    });
}

async function actualizarInfoLote() {
    const loteId = parseInt(document.getElementById('ventaLote').value);
    const infoDiv = document.getElementById('infoLote');

    if (!loteId) {
        infoDiv.style.display = 'none';
        return;
    }

    const lote = await obtenerRegistro('lotes', loteId);
    if (lote) {
        document.getElementById('loteDisponibles').textContent = `${lote.disponibles} pollos`;
        document.getElementById('lotePeso').textContent = `${lote.pesoPromedio} lbs`;
        infoDiv.style.display = 'block';
    }
}

function actualizarCamposVenta() {
    const tipoProducto = document.getElementById('ventaTipoProducto').value;
    const cantidadInput = document.getElementById('ventaCantidad');

    // Sugerir valores por defecto según el tipo de producto
    if (tipoProducto === 'pollo_entero') {
        cantidadInput.value = '1';
    } else {
        cantidadInput.value = '0';
    }
}

// ========================================
// GESTIÓN DE CLIENTES
// ========================================

async function generarIdCliente() {
    const clientes = await obtenerTodos('clientes');

    // Encontrar el número más alto
    let maxNum = 0;
    clientes.forEach(cliente => {
        if (cliente.clienteId && cliente.clienteId.startsWith('CLI-')) {
            const num = parseInt(cliente.clienteId.split('-')[1]);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });

    // Generar nuevo ID
    const nuevoNum = maxNum + 1;
    return `CLI-${nuevoNum.toString().padStart(4, '0')}`;
}

async function mostrarFormCliente() {
    document.getElementById('formCliente').style.display = 'block';

    // Generar y mostrar ID automático
    const nuevoId = await generarIdCliente();
    document.getElementById('clienteId').value = nuevoId;
}

function ocultarFormCliente() {
    document.getElementById('formCliente').style.display = 'none';
    document.getElementById('clienteId').value = '';
    document.getElementById('clienteNombre').value = '';
    document.getElementById('clienteTelefono').value = '';
    document.getElementById('clienteDireccion').value = '';
}

async function agregarCliente() {
    const clienteId = document.getElementById('clienteId').value;
    const nombre = document.getElementById('clienteNombre').value;
    const telefono = document.getElementById('clienteTelefono').value;
    const direccion = document.getElementById('clienteDireccion').value;

    if (!nombre) {
        alert('El nombre es obligatorio');
        return;
    }

    const cliente = {
        id: Date.now(),
        clienteId: clienteId,
        nombre,
        telefono,
        direccion,
        activo: true
    };

    try {
        await agregarRegistro('clientes', cliente);

        // Limpiar formulario
        ocultarFormCliente();

        mostrarAlerta('Cliente agregado exitosamente', 'success');
        await actualizarUI();
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        mostrarAlerta('Error al guardar el cliente', 'error');
    }
}

async function eliminarCliente(id) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
        try {
            await eliminarRegistro('clientes', id);
            mostrarAlerta('Cliente eliminado', 'success');
            await actualizarUI();
        } catch (error) {
            console.error('Error al eliminar cliente:', error);
            mostrarAlerta('Error al eliminar el cliente', 'error');
        }
    }
}

async function renderizarClientes() {
    const container = document.getElementById('listaClientes');
    const clientes = await obtenerTodos('clientes');

    if (clientes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay clientes registrados</p>
            </div>
        `;
        return;
    }

    let html = '<table><thead><tr><th>ID</th><th>Nombre</th><th>Teléfono</th><th>Dirección</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';

    clientes.forEach(cliente => {
        html += `
            <tr>
                <td><strong>${cliente.clienteId}</strong></td>
                <td>${cliente.nombre}</td>
                <td>${cliente.telefono || '-'}</td>
                <td>${cliente.direccion || '-'}</td>
                <td><span class="badge ${cliente.activo ? 'badge-active' : 'badge-inactive'}">${cliente.activo ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn-outline action-btn" onclick="eliminarCliente('${cliente.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    // Actualizar select de ventas
    const select = document.getElementById('ventaCliente');
    select.innerHTML = '<option value="">Seleccionar cliente...</option>';
    clientes.filter(c => c.activo).forEach(cliente => {
        select.innerHTML += `<option value="${cliente.id}">${cliente.nombre} (${cliente.clienteId})</option>`;
    });
}

// ========================================
// GESTIÓN DE PROVEEDORES
// ========================================

async function generarIdProveedor() {
    const proveedores = await obtenerTodos('proveedores');

    // Encontrar el número más alto
    let maxNum = 0;
    proveedores.forEach(proveedor => {
        if (proveedor.proveedorId && proveedor.proveedorId.startsWith('PROV-')) {
            const num = parseInt(proveedor.proveedorId.split('-')[1]);
            if (!isNaN(num) && num > maxNum) {
                maxNum = num;
            }
        }
    });

    // Generar nuevo ID
    const nuevoNum = maxNum + 1;
    return `PROV-${nuevoNum.toString().padStart(4, '0')}`;
}

async function mostrarFormProveedor() {
    document.getElementById('formProveedor').style.display = 'block';

    // Generar y mostrar ID automático
    const nuevoId = await generarIdProveedor();
    document.getElementById('proveedorId').value = nuevoId;
}

function ocultarFormProveedor() {
    document.getElementById('formProveedor').style.display = 'none';
    document.getElementById('proveedorId').value = '';
    document.getElementById('proveedorNombre').value = '';
    document.getElementById('proveedorContacto').value = '';
    document.getElementById('proveedorTelefono').value = '';
    document.getElementById('proveedorDireccion').value = '';
}

async function agregarProveedor() {
    const proveedorId = document.getElementById('proveedorId').value;
    const nombre = document.getElementById('proveedorNombre').value;
    const contacto = document.getElementById('proveedorContacto').value;
    const telefono = document.getElementById('proveedorTelefono').value;
    const direccion = document.getElementById('proveedorDireccion').value;

    if (!nombre) {
        alert('El nombre es obligatorio');
        return;
    }

    const proveedor = {
        id: Date.now(),
        proveedorId: proveedorId,
        nombre,
        contacto,
        telefono,
        direccion,
        activo: true
    };

    try {
        await agregarRegistro('proveedores', proveedor);

        // Limpiar formulario
        ocultarFormProveedor();

        mostrarAlerta('Proveedor agregado exitosamente', 'success');
        await actualizarUI();
    } catch (error) {
        console.error('Error al agregar proveedor:', error);
        mostrarAlerta('Error al guardar el proveedor', 'error');
    }
}

async function eliminarProveedor(id) {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
        try {
            await eliminarRegistro('proveedores', id);
            mostrarAlerta('Proveedor eliminado', 'success');
            await actualizarUI();
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
            mostrarAlerta('Error al eliminar el proveedor', 'error');
        }
    }
}

async function renderizarProveedores() {
    const container = document.getElementById('listaProveedores');
    const proveedores = await obtenerTodos('proveedores');

    if (proveedores.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No hay proveedores registrados</p>
            </div>
        `;
        return;
    }

    let html = '<table><thead><tr><th>ID</th><th>Nombre</th><th>Contacto</th><th>Teléfono</th><th>Dirección</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>';

    proveedores.forEach(proveedor => {
        html += `
            <tr>
                <td><strong>${proveedor.proveedorId}</strong></td>
                <td>${proveedor.nombre}</td>
                <td>${proveedor.contacto || '-'}</td>
                <td>${proveedor.telefono || '-'}</td>
                <td>${proveedor.direccion || '-'}</td>
                <td><span class="badge ${proveedor.activo ? 'badge-active' : 'badge-inactive'}">${proveedor.activo ? 'Activo' : 'Inactivo'}</span></td>
                <td>
                    <button class="btn-outline action-btn" onclick="eliminarProveedor('${proveedor.id}')">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ========================================
// FUNCIONES DE ESTADÍSTICAS
// ========================================

async function actualizarEstadisticasDB() {
    try {
        const lotes = await obtenerTodos('lotes');
        const clientes = await obtenerTodos('clientes');
        const proveedores = await obtenerTodos('proveedores');
        const ventas = await obtenerTodos('ventas');
        const salidas = await obtenerTodos('salidas');

        // Estadísticas de lotes
        const totalPollos = lotes.reduce((sum, lote) => sum + lote.cantidad, 0);
        const pollosDisponibles = lotes.reduce((sum, lote) => sum + lote.disponibles, 0);
        const lotesActivos = lotes.filter(l => l.activo).length;

        // Estadísticas de ventas
        const totalVentas = ventas.length;
        const ingresosTotales = ventas.reduce((sum, venta) => sum + venta.total, 0);

        // Actualizar UI
        document.getElementById('statLotes').textContent = lotesActivos;
        document.getElementById('statPollos').textContent = pollosDisponibles;
        document.getElementById('statClientes').textContent = clientes.filter(c => c.activo).length;
        document.getElementById('statProveedores').textContent = proveedores.filter(p => p.activo).length;
        document.getElementById('statVentas').textContent = totalVentas;
        document.getElementById('statIngresos').textContent = `$${ingresosTotales.toFixed(2)}`;

    } catch (error) {
        console.error('Error al actualizar estadísticas:', error);
    }
}
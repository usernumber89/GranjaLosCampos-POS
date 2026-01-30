// ========================================
// FUNCIONES DE INTERFAZ DE USUARIO - ui.js
// ========================================

// Variables globales de UI
let carrito = [];

// Funciones de navegación por pestañas
function cambiarTab(tabId) {
    // Ocultar todas las pestañas
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    // Remover clase active de todos los botones
    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Mostrar pestaña seleccionada
    document.getElementById(tabId).classList.add('active');

    // Activar botón correspondiente
    event.target.classList.add('active');
}

// Funciones de alertas
function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; color: inherit; cursor: pointer;">×</button>
    `;

    document.querySelector('.container').insertBefore(
        alerta,
        document.querySelector('.tabs')
    );

    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (alerta.parentElement) {
            alerta.remove();
        }
    }, 5000);
}

// ========================================
// CARRITO Y VENTAS
// ========================================

async function agregarAlCarrito() {
    const clienteId = parseInt(document.getElementById('ventaCliente').value);
    const tipoProducto = document.getElementById('ventaTipoProducto').value;
    const loteId = parseInt(document.getElementById('ventaLote').value) || null;
    const cantidad = parseInt(document.getElementById('ventaCantidad').value);
    const peso = parseFloat(document.getElementById('ventaPeso').value);
    const precio = parseFloat(document.getElementById('ventaPrecio').value);

    if (!clienteId || !peso || !precio) {
        alert('Por favor complete cliente, peso y precio');
        return;
    }

    // Validar que si se ingresa cantidad de pollos, haya un lote seleccionado
    if (cantidad > 0 && !loteId) {
        alert('Debe seleccionar un lote si va a descontar pollos del inventario');
        return;
    }

    // Validar disponibilidad si se van a descontar pollos
    if (cantidad > 0 && loteId) {
        const lote = await obtenerRegistro('lotes', loteId);
        if (!lote || lote.disponibles < cantidad) {
            alert('No hay suficientes pollos disponibles en este lote');
            return;
        }
    }

    const cliente = await obtenerRegistro('clientes', clienteId);
    const subtotal = peso * precio;

    // Obtener nombre del lote si existe
    let loteNumero = 'Sin lote';
    if (loteId) {
        const lote = await obtenerRegistro('lotes', loteId);
        loteNumero = lote ? lote.numero : 'Sin lote';
    }

    // Mapear tipo de producto a nombre legible
    const nombresTipoProducto = {
        'pollo_entero': 'Pollo Entero',
        'pechuga': 'Pechuga',
        'entrepierna': 'Entrepierna',
        'pata': 'Patas',
        'menudos': 'Menudos',
        'otros': 'Otros'
    };

    const item = {
        id: Date.now(),
        clienteId: cliente.id,
        clienteNombre: cliente.nombre,
        tipoProducto: nombresTipoProducto[tipoProducto] || tipoProducto,
        loteId: loteId,
        loteNumero: loteNumero,
        cantidad: cantidad,
        peso: peso,
        precio: precio,
        subtotal: subtotal
    };

    carrito.push(item);
    renderizarCarrito();

    // Limpiar campos
    document.getElementById('ventaCantidad').value = '0';
    document.getElementById('ventaPeso').value = '';
    document.getElementById('ventaPrecio').value = '';

    mostrarAlerta('Producto agregado al carrito', 'success');
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    renderizarCarrito();
}

function renderizarCarrito() {
    const container = document.getElementById('carritoItems');
    const totalContainer = document.getElementById('carritoTotal');

    if (carrito.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">El carrito está vacío</p>';
        totalContainer.innerHTML = '';
        return;
    }

    let html = '';
    let total = 0;

    carrito.forEach((item, index) => {
        total += item.subtotal;
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.tipoProducto}</strong><br>
                    <small>Cliente: ${item.clienteNombre} | Lote: ${item.loteNumero}</small><br>
                    <small>Cantidad: ${item.cantidad} | Peso: ${item.peso} lbs | Precio: $${item.precio}/lb</small>
                </div>
                <div class="cart-item-price">
                    $${item.subtotal.toFixed(2)}
                    <button onclick="eliminarDelCarrito(${index})" style="margin-left: 10px; background: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">×</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;

    totalContainer.innerHTML = `
        <div class="cart-total">
            <h3>Total de la Venta</h3>
            <div class="amount">$${total.toFixed(2)}</div>
            <div class="btn-group">
                <button onclick="procesarVenta()" class="btn-primary">💰 Procesar Venta</button>
                <button onclick="vaciarCarrito()" class="btn-danger">🗑️ Vaciar Carrito</button>
            </div>
        </div>
    `;
}

async function procesarVenta() {
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    if (!confirm(`¿Confirmar venta por $${carrito.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}?`)) {
        return;
    }

    try {
        // Procesar cada item del carrito
        for (const item of carrito) {
            // Crear registro de venta
            const venta = {
                id: Date.now() + Math.random(),
                fecha: new Date().toISOString().split('T')[0],
                clienteId: item.clienteId,
                clienteNombre: item.clienteNombre,
                tipoProducto: item.tipoProducto,
                loteId: item.loteId,
                loteNumero: item.loteNumero,
                cantidad: item.cantidad,
                peso: item.peso,
                precio: item.precio,
                total: item.subtotal
            };

            await agregarRegistro('ventas', venta);

            // Actualizar inventario si se vendieron pollos enteros
            if (item.cantidad > 0 && item.loteId) {
                const lote = await obtenerRegistro('lotes', item.loteId);
                if (lote) {
                    lote.disponibles -= item.cantidad;
                    if (lote.disponibles <= 0) {
                        lote.activo = false;
                    }
                    await actualizarRegistro('lotes', lote);
                }
            }
        }

        // Limpiar carrito
        carrito = [];
        renderizarCarrito();

        // Actualizar UI
        await actualizarUI();

        mostrarAlerta('Venta procesada exitosamente', 'success');

        // Generar recibo
        setTimeout(() => {
            if (confirm('¿Desea imprimir el recibo?')) {
                imprimirRecibo(carrito);
            }
        }, 1000);

    } catch (error) {
        console.error('Error al procesar venta:', error);
        mostrarAlerta('Error al procesar la venta', 'error');
    }
}

function vaciarCarrito() {
    if (confirm('¿Vaciar todo el carrito?')) {
        carrito = [];
        renderizarCarrito();
        mostrarAlerta('Carrito vaciado', 'info');
    }
}

// ========================================
// REPORTES Y ESTADÍSTICAS
// ========================================

async function renderizarReportes() {
    const contenedor = document.getElementById('reportesContainer');
    const ventas = await obtenerTodos('ventas');
    const salidas = await obtenerTodos('salidas');

    if (ventas.length === 0 && salidas.length === 0) {
        contenedor.innerHTML = '<div class="empty-state"><p>No hay datos para mostrar en reportes</p></div>';
        return;
    }

    // Calcular estadísticas
    const totalVentas = ventas.reduce((sum, v) => sum + v.total, 0);
    const totalSalidas = salidas.reduce((sum, s) => sum + s.monto, 0);
    const utilidadBruta = totalVentas - totalSalidas;

    // Ventas por producto
    const ventasPorProducto = {};
    ventas.forEach(venta => {
        if (!ventasPorProducto[venta.tipoProducto]) {
            ventasPorProducto[venta.tipoProducto] = { cantidad: 0, total: 0 };
        }
        ventasPorProducto[venta.tipoProducto].cantidad += venta.peso;
        ventasPorProducto[venta.tipoProducto].total += venta.total;
    });

    // Salidas por tipo
    const salidasPorTipo = {};
    salidas.forEach(salida => {
        if (!salidasPorTipo[salida.tipo]) {
            salidasPorTipo[salida.tipo] = 0;
        }
        salidasPorTipo[salida.tipo] += salida.monto;
    });

    let html = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Ingresos Totales</h3>
                <div class="value">$${totalVentas.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h3>Gastos Totales</h3>
                <div class="value">$${totalSalidas.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h3>Utilidad Bruta</h3>
                <div class="value">$${utilidadBruta.toFixed(2)}</div>
            </div>
            <div class="stat-card">
                <h3>Margen</h3>
                <div class="value">${totalVentas > 0 ? ((utilidadBruta / totalVentas) * 100).toFixed(1) : 0}%</div>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <h2>📊 Ventas por Producto</h2>
                <table>
                    <thead><tr><th>Producto</th><th>Peso Total (lbs)</th><th>Ingresos</th></tr></thead>
                    <tbody>
    `;

    Object.entries(ventasPorProducto).forEach(([producto, datos]) => {
        html += `<tr><td>${producto}</td><td>${datos.cantidad.toFixed(2)}</td><td>$${datos.total.toFixed(2)}</td></tr>`;
    });

    html += `
                    </tbody>
                </table>
            </div>

            <div class="card">
                <h2>💸 Gastos por Categoría</h2>
                <table>
                    <thead><tr><th>Categoría</th><th>Monto</th></tr></thead>
                    <tbody>
    `;

    Object.entries(salidasPorTipo).forEach(([tipo, monto]) => {
        html += `<tr><td>${tipo}</td><td>$${monto.toFixed(2)}</td></tr>`;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;

    contenedor.innerHTML = html;
}

// ========================================
// FUNCIONES DE EXPORTACIÓN
// ========================================

async function exportarVentasExcel() {
    const ventas = await obtenerTodos('ventas');

    if (ventas.length === 0) {
        alert('No hay ventas para exportar');
        return;
    }

    const data = ventas.map(v => ({
        Fecha: v.fecha,
        Cliente: v.clienteNombre,
        Producto: v.tipoProducto,
        Lote: v.loteNumero,
        'Cantidad Pollos': v.cantidad,
        'Peso (lbs)': v.peso,
        'Precio/lb': v.precio,
        Total: v.total
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
    XLSX.writeFile(wb, `ventas_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ========================================
// FUNCIONES DE RECIBO
// ========================================

function imprimirRecibo(ventaItems) {
    if (ventaItems.length === 0) return;

    const total = ventaItems.reduce((sum, item) => sum + item.subtotal, 0);
    const fecha = new Date().toLocaleDateString();

    let itemsHTML = '';
    ventaItems.forEach(item => {
        itemsHTML += `
            <div class="receipt-item">
                <span>${item.tipoProducto} (${item.peso} lbs @ $${item.precio}/lb)</span>
                <span>$${item.subtotal.toFixed(2)}</span>
            </div>
        `;
    });

    const reciboHTML = `
        <div id="receipt">
            <div class="receipt-header">
                <h2>🧾 RECIBO DE VENTA</h2>
                <p>Granja Los Campos</p>
                <p>Fecha: ${fecha}</p>
            </div>

            ${itemsHTML}

            <div class="receipt-footer">
                <div class="receipt-total">
                    <span>TOTAL:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <p>¡Gracias por su compra!</p>
            </div>
        </div>
    `;

    // Crear ventana de impresión
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Recibo - Granja Los Campos</title>
                <style>
                    body { font-family: monospace; margin: 0; }
                    #receipt { max-width: 400px; margin: 20px auto; }
                    .receipt-header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 20px; margin-bottom: 20px; }
                    .receipt-item { display: flex; justify-content: space-between; padding: 5px 0; }
                    .receipt-footer { margin-top: 20px; padding-top: 20px; border-top: 2px solid #000; text-align: center; }
                    .receipt-total { display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2em; margin-bottom: 20px; }
                </style>
            </head>
            <body>
                ${reciboHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// ========================================
// FUNCIONES DE IMPORTACIÓN
// ========================================

async function importarClientesExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);

            let importados = 0;
            const clientes = await obtenerTodos('clientes');

            // Encontrar el número más alto existente
            let maxNum = 0;
            clientes.forEach(cliente => {
                if (cliente.clienteId && cliente.clienteId.startsWith('CLI-')) {
                    const num = parseInt(cliente.clienteId.split('-')[1]);
                    if (!isNaN(num) && num > maxNum) {
                        maxNum = num;
                    }
                }
            });

            for (const row of rows) {
                if (row.Nombre || row.nombre) {
                    maxNum++;
                    const nuevoId = `CLI-${maxNum.toString().padStart(4, '0')}`;

                    const cliente = {
                        id: Date.now() + Math.random() * 1000,
                        clienteId: nuevoId,
                        nombre: row.Nombre || row.nombre || '',
                        telefono: row.Telefono || row.telefono || row.Teléfono || '',
                        direccion: row.Direccion || row.direccion || row.Dirección || ''
                    };
                    await agregarRegistro('clientes', cliente);
                    importados++;
                }
            }

            mostrarAlerta(`${importados} clientes importados a la base de datos`, 'success');
            await actualizarUI();
        } catch (error) {
            console.error('Error al importar:', error);
            alert('Error al importar el archivo. Verifique que sea un archivo Excel válido.');
        }
    };
    reader.readAsArrayBuffer(file);
}

async function exportarClientesExcel() {
    const clientes = await obtenerTodos('clientes');

    if (clientes.length === 0) {
        alert('No hay clientes para exportar');
        return;
    }

    const data = clientes.map(c => ({
        'ID Cliente': c.clienteId || '-',
        Nombre: c.nombre,
        Teléfono: c.telefono || '',
        Dirección: c.direccion || ''
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Clientes");
    XLSX.writeFile(wb, `clientes_${new Date().toISOString().split('T')[0]}.xlsx`);
}

async function importarProveedoresExcel(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);

            let importados = 0;
            for (const row of rows) {
                if (row.Nombre || row.nombre || row.Empresa || row.empresa) {
                    const proveedor = {
                        id: Date.now() + Math.random() * 1000,
                        nombre: row.Nombre || row.nombre || row.Empresa || row.empresa || '',
                        contacto: row.Contacto || row.contacto || '',
                        telefono: row.Telefono || row.telefono || row.Teléfono || '',
                        email: row.Email || row.email || row.Correo || row.correo || '',
                        direccion: row.Direccion || row.direccion || row.Dirección || '',
                        tipo: row.Tipo || row.tipo || 'Otros'
                    };
                    await agregarRegistro('proveedores', proveedor);
                    importados++;
                }
            }

            mostrarAlerta(`${importados} proveedores importados a la base de datos`, 'success');
            await actualizarUI();
        } catch (error) {
            console.error('Error al importar:', error);
            alert('Error al importar el archivo. Verifique que sea un archivo Excel válido.');
        }
    };
    reader.readAsArrayBuffer(file);
}

async function exportarProveedoresExcel() {
    const proveedores = await obtenerTodos('proveedores');

    if (proveedores.length === 0) {
        alert('No hay proveedores para exportar');
        return;
    }

    const data = proveedores.map(p => ({
        Empresa: p.nombre,
        Contacto: p.contacto || '',
        Teléfono: p.telefono || '',
        Email: p.email || '',
        Dirección: p.direccion || '',
        Tipo: p.tipo
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Proveedores");
    XLSX.writeFile(wb, `proveedores_${new Date().toISOString().split('T')[0]}.xlsx`);
}

async function exportarSalidasExcel() {
    const salidas = await obtenerTodos('salidas');
    const lotes = await obtenerTodos('lotes');
    const proveedores = await obtenerTodos('proveedores');

    if (salidas.length === 0) {
        alert('No hay salidas para exportar');
        return;
    }

    const data = salidas.map(s => {
        const lote = lotes.find(l => l.id == s.loteId);
        const proveedor = proveedores.find(p => p.id == s.proveedorId);
        return {
            Fecha: s.fecha,
            Tipo: s.tipo,
            Lote: lote ? lote.numero : '',
            Proveedor: proveedor ? proveedor.nombre : '',
            Monto: s.monto,
            Descripcion: s.descripcion || ''
        };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Salidas');
    XLSX.writeFile(wb, `salidas_${new Date().toISOString().split('T')[0]}.xlsx`);
}
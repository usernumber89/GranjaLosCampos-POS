# 🐔 POS Granja Avícola - Migración a Firebase Firestore

## ✅ Cambios Realizados

La aplicación ha sido completamente migrada de **IndexedDB (almacenamiento local del navegador)** a **Firebase Firestore (base de datos NoSQL en la nube)**.

### Ventajas de la migración

✨ **Nube**: Acceso desde cualquier dispositivo con internet  
🔄 **Sincronización**: Los datos se sincronizan en tiempo real  
📱 **Múltiples dispositivos**: Varios usuarios pueden acceder simultáneamente  
🔐 **Seguridad**: Respaldo automático y recuperación de desastres  
⚡ **Escalabilidad**: La base de datos crece automáticamente según necesidades  
🆓 **Costo**: Nivel gratuito generoso para pequeños negocios  

---

## 🚀 Configuración Inicial (IMPORTANTE)

### Paso 1: Crear cuenta en Firebase

1. Ve a [firebase.google.com](https://firebase.google.com)
2. Haz clic en "Ir a la consola"
3. Inicia sesión con tu cuenta Google (crea una si no tienes)

### Paso 2: Crear proyecto

1. Haz clic en "Crear un proyecto"
2. Nombre del proyecto: `pos-granja-avicola` (o el que prefieras)
3. Desactiva Google Analytics (opcional)
4. Haz clic en "Crear proyecto"

### Paso 3: Crear Firestore Database

1. En el menú izquierdo, ve a **Firestore Database**
2. Haz clic en "Crear base de datos"
3. Elige "Modo de prueba" (para desarrollo)
4. Selecciona ubicación: `sa-east-1` (Sudamérica)
5. Haz clic en "Listo"

### Paso 4: Obtener credenciales de Firebase

1. Haz clic en el engranaje (⚙️) en la esquina superior izquierda → **Configuración del proyecto**
2. Ve a la pestaña **"General"**
3. En "Tus apps", busca tu aplicación web o haz clic en **"Agregar app"** → **Web**
4. Se mostrará un objeto con tus credenciales:

```javascript
{
  apiKey: "AIzaSyD...",
  authDomain: "pos-granja-avicola.firebaseapp.com",
  databaseURL: "https://pos-granja-avicola.firebaseio.com",
  projectId: "pos-granja-avicola",
  storageBucket: "pos-granja-avicola.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
}
```

### Paso 5: Actualizar index.html

Abre `index.html` y busca la sección:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto.firebaseio.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "tu-sender-id",
    appId: "tu-app-id"
};
```

Reemplaza estos valores con los de tu proyecto (paso 4).

### Paso 6: Configurar reglas de seguridad

1. En Firebase Console, ve a **Firestore Database** → **Reglas**
2. Reemplaza todo el contenido con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura para desarrollo
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Haz clic en **"Publicar"**

---

## 🔧 Funcionalidades Migradas

Toda la funcionalidad se mantiene igual, pero ahora usa Firebase:

### ✓ Gestión de Lotes
- Agregar, editar, eliminar lotes
- Rastrear disponibilidad de pollos
- Marcar como activo/inactivo

### ✓ Gestión de Clientes
- Registro y búsqueda de clientes
- Importar/exportar desde Excel
- IDs automáticos (CLI-0001, CLI-0002, etc.)

### ✓ Gestión de Proveedores
- Crear y eliminar proveedores
- Tipos: Alimento, Medicamentos, Equipos, Otros
- Importar/exportar desde Excel

### ✓ Registro de Ventas
- Carrito de compras
- Descuento automático de pollos del lote
- Generación de recibos
- Historial de ventas
- Exportar ventas a Excel

### ✓ Registro de Salidas (Gastos)
- Registrar gastos por lote o proveedor
- Categorización de gastos
- Historial con filtros

### ✓ Reportes
- Total de ventas
- Pollos vendidos
- Lotes activos
- Estadísticas generales

### ✓ Backup y Restauración
- Descargar backup en JSON
- Restaurar desde backup
- Limpiar base de datos (con confirmación)

---

## 📊 Estructura de la Base de Datos

```
Firebase Firestore Database
│
├── lotes/ (Colección)
│   ├── documento_id_1
│   │   ├── numero: "LOTE-001"
│   │   ├── cantidad: 500
│   │   ├── disponibles: 450
│   │   ├── pesoPromedio: 2.5
│   │   ├── fecha: "2026-01-29"
│   │   ├── notas: "..."
│   │   └── activo: true
│   │
│   └── -LjK9l2Kj9... (más lotes)
│
├── clientes/
│   ├── -LjK9l2Kj9...
│   │   ├── clienteId: "CLI-0001"
│   │   ├── nombre: "Juan García"
│   │   ├── telefono: "+503 7890-1234"
│   │   └── direccion: "..."
│
├── proveedores/
│   ├── -LjK9l2Kj9...
│   │   ├── nombre: "Empresa X"
│   │   ├── contacto: "..."
│   │   ├── tipo: "Alimento"
│   │   └── email: "..."
│
├── ventas/
│   ├── -LjK9l2Kj9...
│   │   ├── fecha: "2026-01-29T15:30:00.000Z"
│   │   ├── total: 125.50
│   │   └── items: [...]
│
└── salidas/
    ├── -LjK9l2Kj9...
    │   ├── fecha: "2026-01-29"
    │   ├── tipo: "Gasto"
    │   ├── monto: 50.00
    │   └── descripcion: "..."
```

---

## 🔐 Seguridad en Producción

⚠️ **Las reglas actuales permiten acceso sin autenticación**

Antes de usar en producción, considera:

### 1. Agregar autenticación (Recomendado)
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```

### 2. Restringir por usuario
```json
{
  "rules": {
    "lotes": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 3. Implementar roles
```json
{
  "rules": {
    "lotes": {
      ".read": "root.child('usuarios').child(auth.uid).child('rol').val() != null",
      ".write": "root.child('usuarios').child(auth.uid).child('rol').val() === 'admin'"
    }
  }
}
```

---

## 💾 Migración de Datos Antiguos

Si tienes datos en IndexedDB y quieres migrarlos:

1. **Opción A: Exportar desde IndexedDB local**
   - En la aplicación antigua, ve a **Base de Datos** → **Exportar Backup**
   - Se descargará un archivo `backup_*.json`

2. **Opción B: Manual**
   - Agregar registros manualmente en Firebase Console
   - O usar importación por Excel

3. **Opción C: Migraciones automáticas**
   - Contactar para scripting personalizado

---

## 🐛 Solución de Problemas

### "Error de Conexión"
- Verifica que has reemplazado las credenciales correctamente
- Comprueba que la base de datos está creada en Firebase
- Abre la consola del navegador (F12) para más detalles

### "Permiso denegado"
- Asegúrate que las reglas están en "Modo de prueba"
- O configura correctamente los permisos si estás usando autenticación

### "Base de datos vacía"
- Verifica que estés usando la misma configuración de Firebase
- Comprueba en Firebase Console que los datos se guardaron

### Los cambios no se sincronizan
- Comprueba tu conexión a internet
- Abre las DevTools (F12) → Pestaña Console para ver errores
- Verifica que los IDs de registros son únicos

---

## 📱 Múltiples dispositivos

Ahora puedes:
- Abrir la aplicación en computadora, tablet y celular simultáneamente
- Los cambios se sincronizan automáticamente
- Cada dispositivo ve los datos actualizados en tiempo real

---

## 🎯 Próximos Pasos

1. ✅ Configura Firebase (pasos arriba)
2. ✅ Actualiza las credenciales en `index.html`
3. ✅ Prueba la aplicación
4. 📊 Ingresa tus primeros datos
5. 🔐 Cuando estés listo, aumenta la seguridad

---

## 🧪 Archivos de Prueba

He creado dos archivos para verificar que Firebase funciona correctamente:

### `test-firebase.html`
**Prueba básica de conexión:**
- Verifica que Firebase se inicializa correctamente
- Prueba escritura y lectura básica
- Limpia datos de prueba

**Cómo usar:**
1. Abre `test-firebase.html` en tu navegador
2. Haz clic en "Probar Conexión"
3. Si funciona, prueba "Probar Escritura"
4. Luego "Probar Lectura"

### `test-crud.html`
**Prueba completa de funciones CRUD:**
- Agregar registros (igual que en la app principal)
- Obtener todos los registros
- Buscar por ID
- Actualizar registros
- Eliminar registros
- Limpiar todos los datos

**Cómo usar:**
1. Abre `test-crud.html` en tu navegador
2. Agrega algunos registros de prueba
3. Prueba buscar, actualizar y eliminar
4. Verifica que los cambios se reflejan

### `diagnostico-firebase.html`
**Diagnóstico completo de Firebase:**
- Verifica configuración
- Prueba conexión básica
- Testea acceso a Firestore
- Verifica operaciones de escritura
- Diagnostica problemas de red

**Cómo usar:**
1. Abre `diagnostico-firebase.html`
2. Haz clic en "🔬 Iniciar Diagnóstico Completo"
3. Revisa los resultados paso a paso

### `verificacion-rapida.html`
**Verificación paso a paso:**
- Paso 1: Verificar SDK de Firebase
- Paso 2: Inicializar Firebase
- Paso 3: Probar Firestore
- Paso 4: Probar escritura

**Cómo usar:**
1. Abre `verificacion-rapida.html`
2. Ejecuta cada paso en orden
3. Si un paso falla, ahí está el problema

### `prueba-auth.html`
**Prueba completa del sistema de autenticación:**
- Verificar estado de autenticación
- Probar login (registro deshabilitado)
- Testear cierre de sesión
- Verificar acceso a Firestore

**Cómo usar:**
1. Abre `prueba-auth.html`
2. Prueba las funciones de login y cierre de sesión
3. Verifica que el estado se actualice correctamente
4. **Nota**: El registro está deshabilitado - solo administradores pueden crear cuentas

---

## 🔐 Autenticación con Firebase Auth

**✅ HABILITADA**: La aplicación incluye autenticación completa con email/contraseña.

### Configuración Rápida

1. **En Firebase Console** → **Authentication** → **Sign-in method**
2. **Habilita "Email/Password"**
3. **Actualiza las reglas de Firestore** (ver `FIRESTORE_RULES.md`)
4. **¡Listo!** Los usuarios deben iniciar sesión para acceder

### Funciones de Autenticación

- **Inicio de Sesión**: `signIn(email, password)`
- **Registro**: `signUp(email, password)`
- **Cerrar Sesión**: `signOut()`
- **Estado del Usuario**: Automáticamente manejado

### Interfaz de Usuario

- **Formulario de Login**: Aparece automáticamente si no hay sesión
- **Información del Usuario**: Visible en el header cuando autenticado
- **Botón Cerrar Sesión**: Para terminar la sesión

📖 **Lee `README_AUTH.md`** para instrucciones detalladas.

---

## 🚨 Solución de Problemas

### Error: "Error al iniciar la base de datos. Recargue la página."

Este error indica que Firebase no se puede inicializar. Sigue estos pasos:

#### ✅ Verificación Rápida
1. **Abre `verificacion-rapida.html`** y ejecuta todos los pasos
2. Si el Paso 1 falla → Problema con la carga del SDK
3. Si el Paso 2 falla → Credenciales incorrectas
4. Si el Paso 3 falla → Firestore no habilitado
5. Si el Paso 4 falla → Reglas de seguridad incorrectas

#### 🔧 Problema Específico: Versiones de Firebase
**Síntoma:** Diagnóstico funciona pero index.html falla

**Causa:** Incompatibilidad entre versiones de Firebase

**Solución aplicada:**
- ✅ Scripts actualizados a Firebase v9.23.0 con compatibilidad
- ✅ Configuración corregida para usar Firestore
- ✅ Código actualizado para API compatible

**Verificación:**
1. Abre `prueba-index.html` → Debe funcionar
2. Si funciona, abre `index.html` → Debe funcionar también

#### 🔧 Soluciones Comunes

**Problema: Credenciales incorrectas**
```
Solución:
1. Ve a Firebase Console → Configuración del proyecto → General
2. En "Tus apps" → Web app
3. Copia la configuración exacta
4. Actualiza firebaseConfig en index.html
```

**Problema: Firestore no habilitado**
```
Solución:
1. Ve a Firebase Console → Firestore Database
2. Haz clic en "Crear base de datos"
3. Elige "Modo de prueba"
4. Selecciona ubicación (sa-east-1 recomendado)
```

**Problema: Reglas de seguridad**
```
Solución:
1. Ve a Firebase Console → Firestore Database → Reglas
2. Reemplaza con las reglas del archivo FIRESTORE_RULES.md
3. Haz clic en "Publicar"
```

**Problema: Conexión de red**
```
Solución:
1. Verifica tu conexión a internet
2. Desactiva VPN si usas una
3. Prueba en otro navegador
4. Limpia caché del navegador (Ctrl+F5)
```

#### 🆘 Si nada funciona
1. Crea un nuevo proyecto en Firebase Console
2. Actualiza todas las credenciales
3. Habilita Firestore nuevamente
4. Prueba con los archivos de diagnóstico

¿Sigues teniendo problemas? Comparte los resultados del diagnóstico y te ayudo a solucionarlo.

---

## 📞 Soporte

Si tienes problemas:
1. Consulta los logs en la consola del navegador (F12)
2. Verifica Firebase Console → Reglas → Monitoreo
3. Verifica la estructura de datos en Firebase Console

---

**¡Tu aplicación está lista para usar Firebase! 🚀**

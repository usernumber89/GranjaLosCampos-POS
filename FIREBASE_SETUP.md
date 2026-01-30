# Configuración de Firebase para POS Granja Avícola

## Pasos para configurar Firebase

### 1. Crear un proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Agregar proyecto"
3. Ingresa el nombre del proyecto (ej: "pos-granja-avicola")
4. Sigue los pasos de configuración

### 2. Habilitar Realtime Database

1. En la consola de Firebase, ve a "Realtime Database"
2. Haz clic en "Crear base de datos"
3. Selecciona la ubicación (recomendado: sa-east-1 para Sudamérica)
4. Elige el modo de seguridad: **INICIAR EN MODO PRUEBA** (cambiar después en reglas)

### 3. Obtener las credenciales

1. Ve a "Configuración del proyecto" (icono de engranaje)
2. En la pestaña "General", desplázate a la sección "Apps"
3. Haz clic en "Agregar app" → "Web"
4. Copia el objeto de configuración
5. Actualiza las credenciales en `index.html` en la sección `firebaseConfig`

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project.firebaseio.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 4. Configurar las reglas de seguridad

1. En Firebase Console, ve a "Realtime Database" → "Reglas"
2. Reemplaza las reglas con lo siguiente (IMPORTANTE: proteger antes de producción):

```json
{
  "rules": {
    ".read": true,
    ".write": true,
    "lotes": {
      ".indexOn": ["activo", "numero"]
    },
    "clientes": {
      ".indexOn": ["nombre"]
    },
    "proveedores": {
      ".indexOn": ["nombre", "tipo"]
    },
    "ventas": {
      ".indexOn": ["fecha"]
    },
    "salidas": {
      ".indexOn": ["fecha", "loteId", "proveedorId"]
    }
  }
}
```

3. Haz clic en "Publicar"

### 5. Cambios principales en la migración

- **IndexedDB** → **Firebase Realtime Database**
- Las funciones CRUD mantienen la misma interfaz
- Los datos se almacenan en la nube
- Acceso desde cualquier dispositivo con internet
- Sincronización en tiempo real entre clientes

### 6. Estructura de datos en Firebase

La base de datos tendrá la siguiente estructura:

```
root/
├── lotes/
│   ├── lote_id_1
│   ├── lote_id_2
├── clientes/
│   ├── cliente_id_1
│   ├── cliente_id_2
├── proveedores/
│   ├── proveedor_id_1
├── ventas/
│   ├── venta_id_1
├── salidas/
│   ├── salida_id_1
```

### 7. Backup y restauración

Los archivos JSON de backup ahora se guardarán en tu computadora y pueden ser restaurados a Firebase cuando lo desees.

### Notas importantes

⚠️ **SEGURIDAD EN PRODUCCIÓN:**
- Las reglas de seguridad actuales permiten lectura/escritura a cualquiera
- Antes de usar en producción, implementa autenticación
- Considera usar Firebase Authentication
- Limita los permisos según roles de usuario

✅ **VENTAJAS DE FIREBASE:**
- Datos disponibles desde cualquier lugar
- Sincronización en tiempo real
- Escalabilidad automática
- Respaldo automático
- No requiere servidor propio

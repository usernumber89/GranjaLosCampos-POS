# Reglas de Firestore para POS Granja Avícola

## Configuración de Reglas de Seguridad

Ve a Firebase Console → Firestore Database → Reglas y reemplaza todo con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura para desarrollo (cambiar en producción)
    match /{document=**} {
      allow read, write: if true;
    }

    // Reglas más específicas (recomendado para producción):
    /*
    match /lotes/{loteId} {
      allow read, write: if request.auth != null;
    }

    match /clientes/{clienteId} {
      allow read, write: if request.auth != null;
    }

    match /proveedores/{proveedorId} {
      allow read, write: if request.auth != null;
    }

    match /ventas/{ventaId} {
      allow read, write: if request.auth != null;
    }

    match /salidas/{salidaId} {
      allow read, write: if request.auth != null;
    }
    */
  }
}
```

## Índices de Firestore

Firestore requiere índices para consultas complejas. Si ves errores de índice, ve a:

Firebase Console → Firestore Database → Índices

Y crea estos índices compuestos:

### Índices requeridos:

1. **Colección:** `lotes`
   - Campo: `activo` (Ascendente)
   - Campo: `numero` (Ascendente)

2. **Colección:** `clientes`
   - Campo: `nombre` (Ascendente)

3. **Colección:** `proveedores`
   - Campo: `nombre` (Ascendente)
   - Campo: `tipo` (Ascendente)

4. **Colección:** `ventas`
   - Campo: `fecha` (Descendente)

5. **Colección:** `salidas`
   - Campo: `fecha` (Descendente)
   - Campo: `loteId` (Ascendente)
   - Campo: `proveedorId` (Ascendente)

## Verificación

Después de configurar las reglas:

1. Abre la aplicación
2. Ve a la pestaña "Base de Datos"
3. Deberías ver "✓ Conectada" en verde
4. Prueba agregar un lote
5. Verifica en Firebase Console que aparezca

## Solución de Problemas

### Error: "Missing or insufficient permissions"
→ Verifica que las reglas permitan lectura/escritura

### Error: "Index required"
→ Crea los índices mencionados arriba

### Error: "Offline"
→ Verifica tu conexión a internet

### Error: "Invalid collection name"
→ Las colecciones deben ser: lotes, clientes, proveedores, ventas, salidas
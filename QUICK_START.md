# ⚡ GUÍA RÁPIDA (5 MINUTOS)

## 🎯 Lo que pasó

Tu aplicación pasó de usar:
- ❌ **IndexedDB** (base de datos local del navegador)
- ✅ **Firebase** (base de datos en la nube)

---

## ⏱️ Configura en 5 minutos

### 1. Ve a Firebase (2 min)
1. Abre https://console.firebase.google.com/
2. Haz clic "Crear proyecto"
3. Nombre: `pos-granja-avicola`
4. Confirma todos los pasos

### 2. Crear Base de Datos (1 min)
1. Menú izquierdo → "Realtime Database"
2. "Crear base de datos"
3. Ubicación: `sa-east-1` (Sudamérica)
4. Modo: **"Modo de prueba"**

### 3. Copiar Credenciales (1 min)
1. Engranaje ⚙️ → "Configuración del proyecto"
2. Pestaña "General"
3. Sección "Tus apps" → Copiar el código

### 4. Pegar Credenciales (1 min)
1. Abre `index.html` en editor
2. Busca: `const firebaseConfig = {`
3. Reemplaza los valores (línea ~1110)

```javascript
// Busca esto:
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    databaseURL: "https://tu-proyecto.firebaseio.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "tu-sender-id",
    appId: "tu-app-id"
};

// Y reemplaza con tus valores de Firebase Console
```

---

## ✅ Verificar que Funciona

1. Abre `index.html` en navegador
2. Ve a Tab "Lotes"
3. Crea un lote de prueba
4. **Recarga la página** ← El lote debe estar ahí

**¡Si ves el lote después de recargar = funciona! ✓**

---

## 📱 Ahora Tienes

✅ Datos en la nube (no solo en tu computadora)  
✅ Acceso desde celular, tablet, otra computadora  
✅ Backups automáticos  
✅ Sincronización en tiempo real  

---

## 📂 Archivos Útiles

1. **README_FIREBASE.md** ← Guía completa (léelo si quieres más detalles)
2. **migrate-idb-to-firebase.html** ← Si tienes datos antiguos
3. **MIGRATION_CHECKLIST.md** ← Checklist completo

---

## 🆘 Si Algo No Funciona

### Error: "Error de Conexión"
→ Verifica que copiaste bien las credenciales

### Error: "Base de datos no definida"
→ Asegúrate de haber creado la BD en Firebase

### No se guardan los datos
→ Abre F12, pestaña "Console", busca errores

---

## 🎉 ¡Listo!

Tu aplicación ahora usa Firebase en lugar de IndexedDB.

**Siguiente paso:** Lee `README_FIREBASE.md` si quieres entender más.

---

*Migración completada: ✅*

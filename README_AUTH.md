# 🔐 Autenticación Firebase - Granja Los Campos

## ✅ Autenticación Habilitada

La aplicación **Granja Los Campos** incluye **autenticación completa con Firebase Auth** usando email y contraseña.

### Características Implementadas

✨ **Inicio de Sesión Seguro**: Acceso controlado con email/contraseña
🚫 **Registro Restringido**: Solo administradores pueden crear cuentas
🚪 **Cerrar Sesión**: Opción para salir del sistema
🔄 **Persistencia**: La sesión se mantiene entre recargas
🛡️ **Protección de Datos**: Solo usuarios autorizados acceden
🔒 **Validaciones de Seguridad**: Email y contraseña validados
⚡ **Interfaz Moderna**: Formulario de login elegante

---

## 🚀 Cómo Usar la Autenticación

### Inicio de Sesión

1. **Abre la aplicación** (`index.html`)
2. **Aparecerá el formulario de login seguro**
3. **Ingresa tu email autorizado** (solo usuarios registrados)
4. **Ingresa tu contraseña**
5. **Opcional**: Marca "Recordarme" para mantener la sesión
6. **Haz clic en "🚪 Iniciar Sesión"**
7. **¡Acceso concedido!**

### Cerrar Sesión

1. **En la parte superior derecha** verás tu email
2. **Haz clic en "🚪 Cerrar Sesión"**
3. **Sesión terminada** - volverás al login seguro

### Recuperar Contraseña

1. **En el formulario de login**, ingresa tu email
2. **Haz clic en "¿Olvidaste tu contraseña?"**
3. **Recibirás un email** con instrucciones para restablecer

---

## 🔧 Configuración en Firebase Console

### 1. Habilitar Authentication

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. En el menú izquierdo → **Authentication**
4. Ve a la pestaña **"Sign-in method"**
5. Busca **"Email/Password"** y haz clic en **"Enable"**
6. ✅ Listo

### 2. Actualizar Reglas de Seguridad

1. Ve a **Firestore Database** → **Reglas**
2. Reemplaza con las reglas de `FIRESTORE_RULES.md`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para producción - requieren autenticación
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Haz clic **"Publicar"**

---

## 📋 Funciones de Autenticación

### `signIn(email, password)`
Inicia sesión con credenciales existentes
```javascript
const result = await signIn('usuario@email.com', 'password123');
if (result.success) {
    console.log('Login exitoso');
} else {
    console.log('Error:', result.error);
}
```

### `signUp(email, password)`
Crea una nueva cuenta de usuario
```javascript
const result = await signUp('nuevo@email.com', 'password123');
if (result.success) {
    console.log('Cuenta creada');
}
```

### `signOut()`
Cierra la sesión actual
```javascript
const result = await signOut();
if (result.success) {
    console.log('Sesión cerrada');
}
```

### `getAuthErrorMessage(errorCode)`
Convierte códigos de error en mensajes legibles
```javascript
const message = getAuthErrorMessage('auth/wrong-password');
// Retorna: "Contraseña incorrecta"
```

---

## 🔐 Estados de Autenticación

### Usuario Autenticado
- ✅ Acceso completo a todas las funciones
- ✅ Datos sincronizados en la nube
- ✅ Información del usuario visible en el header
- ✅ Botón "Cerrar Sesión" disponible

### Usuario No Autenticado
- ❌ Acceso bloqueado a la aplicación
- ❌ Formulario de login visible
- ❌ Datos no accesibles

---

## 🛠️ Solución de Problemas

### "Usuario no encontrado"
- El email no está registrado
- Solución: Usa "Registrarse" para crear la cuenta

### "Contraseña incorrecta"
- La contraseña no coincide
- Solución: Verifica mayúsculas/minúsculas

### "La contraseña es muy débil"
- Debe tener mínimo 6 caracteres
- Solución: Usa una contraseña más larga

### "Error de conexión"
- Problemas de internet
- Solución: Verifica tu conexión y reintenta

### "Usuario deshabilitado"
- La cuenta fue desactivada en Firebase Console
- Solución: Contacta al administrador

---

## 📊 Gestión de Usuarios

### Ver Usuarios en Firebase Console

1. Ve a **Authentication** → **Users**
2. Verás todos los usuarios registrados
3. Puedes editar, eliminar o deshabilitar cuentas

### Restablecer Contraseñas

1. Los usuarios pueden restablecer su contraseña desde el login
2. O puedes hacerlo desde Firebase Console

---

## 🔒 Seguridad Implementada

- ✅ **Autenticación requerida** para acceder a datos
- ✅ **Persistencia local** de sesiones
- ✅ **Validación de emails** automática
- ✅ **Protección contra ataques** comunes
- ✅ **Mensajes de error** descriptivos

---

## 🎯 Próximos Pasos

1. ✅ **Autenticación básica** implementada
2. 🔄 **Próximamente**: Verificación de email
3. 🔄 **Próximamente**: Restablecimiento de contraseña
4. 🔄 **Próximamente**: Roles de usuario (admin, empleado)

¿Necesitas ayuda con algún aspecto de la autenticación?
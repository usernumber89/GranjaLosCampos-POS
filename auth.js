// ========================================
// SISTEMA DE AUTENTICACIÓN - auth.js
// ========================================

// Variables globales de autenticación
let auth;
let currentUser = null;

// Inicializar autenticación
function initAuth() {
    auth = firebase.auth();

    // Configurar persistencia de autenticación
    auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    // Listener de estado de autenticación
    auth.onAuthStateChanged((user) => {
        currentUser = user;
        updateAuthUI(user);

        if (user) {
            console.log('Usuario autenticado:', user.email);
            document.getElementById('dbStatus').classList.add('connected');
            // Solo actualizar UI si ya se inicializó la base de datos
            if (db) {
                actualizarUI();
                actualizarEstadisticasDB();
            }
        } else {
            console.log('Usuario no autenticado');
            document.getElementById('dbStatus').classList.remove('connected');
            showLoginForm();
        }
    });
}

// Funciones de autenticación
async function signIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Usuario inició sesión:', userCredential.user.email);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        return { success: false, error: getAuthErrorMessage(error.code) };
    }
}

async function signOut() {
    try {
        await auth.signOut();
        console.log('Usuario cerró sesión');
        return { success: true };
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return { success: false, error: error.message };
    }
}

function getAuthErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/invalid-email':
            return 'Correo electrónico inválido';
        case 'auth/user-disabled':
            return 'Usuario deshabilitado';
        case 'auth/user-not-found':
            return 'Usuario no encontrado';
        case 'auth/wrong-password':
            return 'Contraseña incorrecta';
        case 'auth/email-already-in-use':
            return 'El correo ya está registrado';
        case 'auth/weak-password':
            return 'La contraseña es muy débil (mínimo 6 caracteres)';
        case 'auth/network-request-failed':
            return 'Error de conexión';
        case 'auth/too-many-requests':
            return 'Demasiados intentos, intenta más tarde';
        default:
            return 'Error de autenticación: ' + errorCode;
    }
}

// Funciones de validación
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Funciones de UI de autenticación
function updateAuthUI(user) {
    const loginForm = document.getElementById('loginForm');
    const mainApp = document.getElementById('mainApp');
    const userInfo = document.getElementById('userInfo');

    if (user) {
        // Usuario autenticado
        loginForm.style.display = 'none';
        mainApp.style.display = 'block';
        userInfo.innerHTML = `
            <span>👤 ${user.email}</span>
            <button onclick="handleSignOut()" class="btn-secondary" style="margin-left: 10px; font-size: 0.9rem;">
                🚪 Cerrar Sesión
            </button>
        `;
    } else {
        // Usuario no autenticado
        loginForm.style.display = 'block';
        mainApp.style.display = 'none';
        userInfo.innerHTML = '';
    }
}

function showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const mainApp = document.getElementById('mainApp');

    loginForm.style.display = 'block';
    mainApp.style.display = 'none';
}

async function handleLoginSubmit(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginButton = document.getElementById('loginButton');
    const loginSpinner = document.getElementById('loginSpinner');
    const btnText = loginButton.querySelector('.btn-text');

    // Validaciones de seguridad
    if (!validateEmail(email)) {
        showLoginError('Por favor ingresa un correo electrónico válido');
        return;
    }

    if (!validatePassword(password)) {
        showLoginError('La contraseña debe tener al menos 6 caracteres');
        return;
    }

    // Cambiar persistencia según "Recordarme"
    if (rememberMe) {
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    } else {
        await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    }

    // Mostrar loading
    loginButton.disabled = true;
    btnText.textContent = 'Iniciando sesión...';
    loginSpinner.style.display = 'block';

    // Ocultar error anterior
    hideLoginError();

    try {
        const result = await signIn(email, password);

        if (result.success) {
            console.log('Login exitoso');
            // La UI se actualizará automáticamente por el listener de auth
        } else {
            showLoginError(result.error);
        }
    } catch (error) {
        console.error('Error inesperado:', error);
        showLoginError('Error inesperado. Intenta de nuevo.');
    } finally {
        // Restaurar botón
        loginButton.disabled = false;
        btnText.textContent = '🚪 Iniciar Sesión';
        loginSpinner.style.display = 'none';
    }
}

async function handleSignOut() {
    const result = await signOut();
    if (!result.success) {
        alert('Error al cerrar sesión: ' + result.error);
    }
}

function showLoginError(message) {
    const errorDiv = document.getElementById('loginError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function hideLoginError() {
    const errorDiv = document.getElementById('loginError');
    errorDiv.style.display = 'none';
}

function showForgotPassword() {
    const email = document.getElementById('loginEmail').value.trim();

    if (!email) {
        showLoginError('Ingresa tu correo electrónico primero');
        return;
    }

    if (!validateEmail(email)) {
        showLoginError('Ingresa un correo electrónico válido');
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert('Se ha enviado un enlace de recuperación a tu correo electrónico');
        })
        .catch((error) => {
            console.error('Error al enviar recuperación:', error);
            showLoginError('Error al enviar el enlace de recuperación');
        });
}
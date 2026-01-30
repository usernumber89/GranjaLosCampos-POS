// Ejemplo de configuración de Firebase
// Reemplaza estos valores con los de tu proyecto real

const firebaseConfigExample = {
    apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    authDomain: "tu-proyecto-nombre.firebaseapp.com",
    databaseURL: "https://tu-proyecto-nombre.firebaseio.com",
    projectId: "tu-proyecto-nombre",
    storageBucket: "tu-proyecto-nombre.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};

/*
INSTRUCCIONES PARA OBTENER ESTAS CREDENCIALES:

1. Ve a https://console.firebase.google.com/
2. Selecciona tu proyecto
3. Haz clic en el icono de engranaje (Configuración) en la esquina superior izquierda
4. Ve a la pestaña "General"
5. En "Tus apps", busca tu aplicación web
6. Haz clic en "Config" para ver las credenciales
7. Copia los valores y pégalos en el firebaseConfig del index.html

Cada valor:
- apiKey: Clave de API (muy larga)
- authDomain: nombre-del-proyecto.firebaseapp.com
- databaseURL: https://nombre-del-proyecto.firebaseio.com
- projectId: nombre-del-proyecto
- storageBucket: nombre-del-proyecto.appspot.com
- messagingSenderId: Número de ID del remitente
- appId: ID de la aplicación
*/

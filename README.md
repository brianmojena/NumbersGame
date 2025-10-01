# 🎯 Juego de Números - Adivina el Código

Un juego multijugador en tiempo real donde los jugadores deben adivinar números secretos de 4 dígitos.

## 📋 Descripción

Cada jugador elige un número secreto de 4 dígitos (sin repetir). Los demás jugadores intentan adivinarlo recibiendo pistas:
- **Bulls (🎯)**: Dígito correcto en la posición correcta
- **Cows (🐮)**: Dígito correcto en la posición incorrecta

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor:
```bash
npm start
```

3. Abrir el navegador en:
```
http://localhost:3000
```

## 🎮 Cómo Jugar

1. **Crear o Unirse a una Sala**
   - Ingresa tu nombre
   - Crea una nueva sala o únete con un código existente

2. **Establecer tu Número Secreto**
   - Elige un número de 4 dígitos
   - Los dígitos no pueden repetirse
   - Ejemplo válido: 1234, 5678, 9012

3. **Adivinar los Números**
   - Selecciona un jugador objetivo
   - Ingresa tu intento
   - Recibe pistas (Bulls y Cows)
   - ¡Sigue intentando hasta adivinar!

## 🛠️ Tecnologías

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Comunicación**: Socket.io en tiempo real
- **Despliegue**: Optimizado para Vercel

## 📦 Estructura del Proyecto

```
Numbers/
├── server.js       # Servidor backend con Socket.io
├── public/
│   ├── index.html  # Interfaz del juego
│   ├── style.css   # Estilos modernos
│   └── game.js     # Lógica del cliente
├── vercel.json     # Configuración de Vercel
├── package.json    # Dependencias
└── README.md       # Documentación
```

## 🎨 Características

- ✅ Salas multijugador con códigos únicos
- ✅ Comunicación en tiempo real
- ✅ Interfaz moderna y responsive
- ✅ Sistema de pistas (Bulls & Cows)
- ✅ Historial de intentos
- ✅ Notificaciones en tiempo real
- ✅ Validación de números

## 🔧 Configuración

El servidor corre por defecto en el puerto 3000. Para cambiar el puerto:

```bash
PORT=8080 npm start
```

## 🚀 Desplegar en Vercel

### Opción 1: Desde la Web de Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Vercel detectará automáticamente la configuración
5. Click en "Deploy"

### Opción 2: Usando Vercel CLI

1. Instala Vercel CLI:
```bash
npm install -g vercel
```

2. Desde la carpeta del proyecto:
```bash
vercel
```

3. Sigue las instrucciones en pantalla
4. Para producción:
```bash
vercel --prod
```

### Variables de Entorno (Opcional)

Si necesitas configurar variables de entorno, créalas en el dashboard de Vercel o usando:

```bash
vercel env add
```

## 📝 Reglas del Juego

1. Los números deben tener exactamente 4 dígitos
2. No se pueden repetir dígitos (ej: 1123 es inválido)
3. Los dígitos válidos son del 0 al 9
4. No puedes adivinar tu propio número
5. Gana quien adivine primero el número de otro jugador

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de abrir issues o pull requests.

## 📄 Licencia

MIT License - Siéntete libre de usar este proyecto como desees.

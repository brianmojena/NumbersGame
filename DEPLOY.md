# 🚀 Guía Rápida de Despliegue en Vercel

## Prerrequisitos

1. Cuenta en [GitHub](https://github.com)
2. Cuenta en [Vercel](https://vercel.com)
3. Tu código subido a un repositorio de GitHub

## Pasos para Desplegar

### 1. Subir el Proyecto a GitHub

```bash
# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit - Numbers Game"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### 2. Desplegar en Vercel

#### Opción A: Desde la Web (Más Fácil)

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta de GitHub
3. Click en **"Add New..."** → **"Project"**
4. Selecciona tu repositorio de GitHub
5. Vercel detectará automáticamente la configuración
6. Click en **"Deploy"**
7. ¡Listo! En unos segundos tendrás tu URL

#### Opción B: Con Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Desde la carpeta del proyecto
vercel login

# Desplegar (modo preview)
vercel

# Desplegar a producción
vercel --prod
```

## ✅ Verificación

Después del despliegue:

1. Vercel te dará una URL (ej: `https://tu-proyecto.vercel.app`)
2. Abre la URL en tu navegador
3. Prueba crear una sala
4. Abre otra pestaña/ventana con la misma URL
5. Únete a la sala con el código
6. ¡Juega!

## 🔧 Configuración Adicional

### Dominio Personalizado

1. En el dashboard de Vercel, ve a tu proyecto
2. Click en **"Settings"** → **"Domains"**
3. Agrega tu dominio personalizado
4. Sigue las instrucciones para configurar DNS

### Variables de Entorno

Si necesitas agregar variables de entorno:

1. Dashboard de Vercel → Tu proyecto → **"Settings"** → **"Environment Variables"**
2. Agrega las variables necesarias
3. Redeploy el proyecto

## 🐛 Solución de Problemas

### El juego no conecta

- Verifica que Socket.io esté correctamente instalado
- Revisa los logs en el dashboard de Vercel
- Asegúrate de que `vercel.json` esté en la raíz del proyecto

### Error 404

- Verifica que la carpeta `public` contenga todos los archivos
- Revisa las rutas en `vercel.json`

### Desconexiones frecuentes

- Socket.io en Vercel tiene limitaciones con conexiones muy largas
- Considera usar Railway o Render para mejor estabilidad con WebSockets

## 📊 Monitoreo

- Ve los logs en tiempo real: Dashboard → Tu proyecto → **"Deployments"** → Click en el deployment → **"Logs"**
- Vercel Analytics: Dashboard → Tu proyecto → **"Analytics"**

## 🔄 Actualizaciones

Cada vez que hagas `git push` a tu repositorio, Vercel automáticamente:
1. Detectará los cambios
2. Hará un nuevo build
3. Desplegará la nueva versión

## 💡 Consejos

- Usa ramas para probar cambios antes de producción
- Vercel crea previews automáticos para cada Pull Request
- Revisa los logs si algo no funciona
- La primera carga puede ser lenta (cold start)

## 🆘 Soporte

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Socket.io](https://socket.io/docs/)
- [Comunidad de Vercel](https://github.com/vercel/vercel/discussions)

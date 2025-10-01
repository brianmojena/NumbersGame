# ⚡ Comandos Rápidos

## 🏃 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm start

# Abrir en navegador
open http://localhost:3000
```

## 📤 Subir a GitHub

```bash
# Primera vez
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/numbers-game.git
git push -u origin main

# Actualizaciones posteriores
git add .
git commit -m "Descripción de cambios"
git push
```

## 🚀 Desplegar en Vercel

### Opción 1: Web (Recomendado)
1. Ve a https://vercel.com
2. New Project → Import from GitHub
3. Select repository → Deploy

### Opción 2: CLI
```bash
# Instalar CLI (solo una vez)
npm install -g vercel

# Login
vercel login

# Desplegar
vercel

# Desplegar a producción
vercel --prod
```

## 🔍 Verificar

```bash
# Ver si el servidor está corriendo
lsof -ti:3000

# Detener servidor
kill $(lsof -ti:3000)

# Ver logs en tiempo real
tail -f *.log

# Probar endpoint
curl http://localhost:3000
```

## 🧹 Limpieza

```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install

# Limpiar cache de Vercel
rm -rf .vercel
```

## 📦 Actualizar Dependencias

```bash
# Ver versiones actuales
npm list

# Actualizar todo
npm update

# Actualizar package específico
npm install socket.io@latest
```

## 🐛 Debugging

```bash
# Ver logs del servidor
npm start

# Modo verbose
DEBUG=* npm start

# Verificar puerto
netstat -an | grep 3000
```

## 🎯 Atajos Útiles

```bash
# Todo en uno: instalar y correr
npm install && npm start

# Reiniciar servidor rápido
kill $(lsof -ti:3000) && npm start

# Ver estructura del proyecto
ls -R

# Buscar en archivos
grep -r "texto" .
```

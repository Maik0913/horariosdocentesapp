# Horarios Docentes App

Proyecto con tres partes que se despliegan por separado:

- `front/` → página web (HTML/JS) → se despliega en **Vercel**
- `back/`  → API en Node.js/Express → se despliega en **Render**
- Base de datos MySQL → se despliega en **Railway** (o cualquier MySQL en la nube)

## Antes de subir a GitHub

1. El archivo `variables/.env` **no debe subirse**. Ya está protegido por `.gitignore`.
2. La carpeta `back/node_modules/` tampoco debe subirse — se reinstala automáticamente con `npm install`. Ya está excluida en `.gitignore`.
3. `variables/.env.example` muestra qué variables se necesitan, sin valores reales.

## Base de datos (database_setup.sql)

Este archivo recrea la tabla `horarios_docentes`. Cópialo y ejecútalo en el editor de consultas de tu base de datos MySQL en la nube (por ejemplo, en Railway, en la pestaña "Query").

## Variables de entorno necesarias (Render)

```
DB_HOST=host_que_te_da_railway
DB_PORT=puerto_que_te_da_railway
DB_USER=usuario_que_te_da_railway
DB_PASSWORD=password_que_te_da_railway
DB_NAME=horariosdocentes
DB_SSL=true
PORT=10000
```

## Pasos generales

1. Crea la base de datos MySQL en Railway y ejecuta `database_setup.sql`.
2. Copia las credenciales (host, puerto, usuario, password) que te da Railway.
3. Despliega `back/` en Render, con esas credenciales como variables de entorno.
4. Copia la URL pública que te da Render.
5. Pega esa URL + `/api/horarios` en `front/app.js`, en la constante `API`.
6. Despliega `front/` en Vercel.

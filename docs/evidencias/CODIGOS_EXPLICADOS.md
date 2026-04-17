# Codigos explicados (sin imagenes)

Este documento reemplaza las evidencias visuales tecnicas de Router y Backend con explicaciones de codigo, para mantener la guia didactica sin depender de capturas.

## 1) Router principal (`src/App.jsx`)

Se usa `react-router-dom` para definir una estructura base con layout compartido:

- Ruta raiz (`/`) con `HomeLayout`.
- Redireccion inicial a `/productos`.
- Rutas de negocio:
  - `/productos`
  - `/productos/:id`
  - `/cesta`
- Ruta comodin (`*`) que redirige a `/productos`.

Beneficio: navegacion clara y controlada, con fallback para rutas no validas.

## 2) Layout + navegacion (`src/components/layout/HomeLayout.jsx`, `Header.jsx`)

- `HomeLayout` renderiza `Header`, `Outlet` y `Footer`.
- `Outlet` permite mostrar cada pagina dentro de una estructura comun.
- En `Header`, `NavLink` marca visualmente la ruta activa.

Beneficio: misma experiencia visual en todas las paginas sin duplicar codigo.

## 3) Arranque de backend (`package.json`, `server/index.js`, `server/app.js`)

Scripts recomendados:

- `npm run server`: arranca backend en modo normal.
- `npm run server:dev` o `npm run server:nodemon`: modo desarrollo.

`server/index.js` funciona como punto de entrada y delega en `server/app.js`, donde viven middlewares y endpoints.

## 4) Endpoint de prueba `/ping`

Se define un endpoint simple para validar que el servidor esta en linea:

- URL: `GET /ping`
- Respuesta: estado de servicio (ejemplo: `ok`)

Beneficio: permite verificar rapidamente conectividad antes de probar consultas reales.

## 5) Modulo de base de datos (`server/db.js`)

`db.js` centraliza la conexion a PostgreSQL:

- Carga variables de entorno.
- Crea un `Pool` de `pg`.
- Expone helper para ejecutar consultas SQL.

Beneficio: separa acceso a datos de la logica HTTP y facilita mantenimiento.

## 6) Endpoint de productos (`server/app.js`)

El endpoint de productos consulta Northwind y retorna datos consumibles por frontend:

- `GET /products` (listado)
- `GET /api/products/:id` (detalle)

Se maneja con `try/catch` para:

- retornar errores controlados,
- evitar caidas del servidor,
- dar mensajes utiles durante pruebas.

## Nota de seguridad para GitHub

No documentar ni subir:

- claves privadas,
- passwords reales,
- archivos locales de cadena (`blockchain/data*`, `keystore`, `jwtsecret`, `password.txt`).

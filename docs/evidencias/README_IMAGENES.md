# Evidencias Visuales

Este archivo define el orden de las imagenes usadas para documentar el proceso.

## Estructura recomendada

- Guardar capturas en la carpeta `docs/evidencias/imagenes/`.
- Usar nombres con prefijo numerico para mantener el orden.

## Orden de evidencias

1. `01-dbeaver-configuracion-conexion.png`  
   Pantalla de configuracion de la conexion en DBeaver (host, puerto, database, usuario).

2. `02-docker-contenedor-postgres-activo.png`  
   Pantalla de Docker Desktop mostrando el contenedor PostgreSQL en estado activo.

3. `03-dbeaver-conexion-exitosa.png`  
   Pantalla de prueba de conexion exitosa en DBeaver.

4. `04-metamask-add-custom-network.png`  
   Pantalla de MetaMask al seleccionar **Add a custom network** para configurar la red local.

5. `05-metamask-saldos-confirmados.png`  
   Confirmacion visual en MetaMask de los saldos configurados para las cuentas de la red local.

6. `06-esquema-frontend.png`  
   Boceto del flujo visual del frontend (Home, Producto y Cesta).

7. `07-home-catalogo-productos.png`  
   Vista Home con tarjetas de productos.

8. `08-cesta-resumen-pago.png`  
   Vista Cesta con totales en USD y conversion a ETH.

9. `09-metamask-transaccion-pendiente.png`  
   Evidencia de transaccion enviada en estado pendiente.

10. `10-metamask-transaccion-confirmada.png`  
    Evidencia de transaccion confirmada.

## Documentacion sin imagen (codigo explicado)

Las capturas tecnicas de Router y Backend (antes posiciones 7-14) se reemplazan por documentacion explicada en:

- `docs/evidencias/CODIGOS_EXPLICADOS.md`

Contenido documentado en ese archivo:

- Configuracion de rutas (`BrowserRouter`, `Routes`, `Route`).
- Layout con `Outlet` y navegacion con `NavLink`.
- Comandos de arranque backend (`server`, `server:dev`).
- Endpoint `/ping` para prueba de vida.
- Modulo de base de datos PostgreSQL.
- Endpoint de productos con `try/catch` y manejo de errores.

## Ejemplo para insertar imagen en Markdown

```md
![DBeaver conexion exitosa](./imagenes/03-dbeaver-conexion-exitosa.png)
```

## Nota

No incluir capturas con credenciales visibles ni secretos en texto plano.

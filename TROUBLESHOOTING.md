# Troubleshooting del Proyecto Cesta

Este documento registra errores comunes encontrados durante el desarrollo y como resolverlos paso a paso.

## Error 1: DBeaver muestra "error de autenticacion"

### Sintoma

- El contenedor `pg` esta corriendo en Docker.
- En DBeaver aparece error de autenticacion al conectar con PostgreSQL.

### Diagnostico realizado

Se verifico que el contenedor esta activo:

```bash
docker ps --filter name=pg
```

Se verifico que la variable de entorno de password existe en el contenedor:

```bash
docker inspect pg --format "{{range .Config.Env}}{{println .}}{{end}}"
```

Se probo login real dentro del contenedor con credenciales:

```bash
docker exec -e PGPASSWORD=<DB_PASSWORD> <NOMBRE_CONTENEDOR> psql -U <DB_USER> -d <DB_NAME> -c "select current_user, current_database();"
```

Resultado: la autenticacion por CLI fue correcta, por lo que el servicio PostgreSQL estaba funcionando.

### Causas probables en DBeaver

1. Password mal escrita (por ejemplo, sin guiones o con espacios).
2. Password vieja guardada en cache de DBeaver.
3. Se reutilizo una base con datos persistidos de otra ejecucion y la clave original era diferente.
4. Configuracion de conexion distinta a la del contenedor (`host`, `puerto`, `database`, `usuario`).

### Configuracion correcta en DBeaver

- Host: `localhost`
- Puerto: `<DB_PORT>`
- Database: `<DB_NAME>`
- Usuario: `<DB_USER>`
- Password: `<DB_PASSWORD>`

### Solucion aplicada

Se forzo nuevamente la password del usuario de base de datos dentro del contenedor:

```bash
docker exec <NOMBRE_CONTENEDOR> psql -U <DB_USER> -d <DB_NAME> -c "ALTER USER <DB_USER> WITH PASSWORD '<DB_PASSWORD>';"
```

### Si aun falla

1. En DBeaver, editar la conexion y volver a escribir la password manualmente.
2. Desactivar y volver a activar "Save password".
3. Probar conexion de nuevo.
4. Si persiste, eliminar y crear la conexion de DBeaver desde cero.

## Cambio aplicado: Conexion nueva desde cero

Para evitar conflicto con configuraciones previas, se recreo PostgreSQL con nuevos datos:

- Contenedor: `<NOMBRE_CONTENEDOR>`
- Host: `localhost`
- Puerto: `<DB_PORT_NUEVO>`
- Database: `<DB_NAME_NUEVA>`
- Usuario: `<DB_USER_NUEVO>`
- Password: `<DB_PASSWORD_NUEVO>`

Comando usado:

```bash
docker run -d --name <NOMBRE_CONTENEDOR> -e POSTGRES_USER=<DB_USER_NUEVO> -e POSTGRES_PASSWORD=<DB_PASSWORD_NUEVO> -e POSTGRES_DB=<DB_NAME_NUEVA> -p <DB_PORT_NUEVO>:5432 postgres
```

Validacion:

```bash
docker exec -e PGPASSWORD=<DB_PASSWORD_NUEVO> <NOMBRE_CONTENEDOR> psql -U <DB_USER_NUEVO> -d <DB_NAME_NUEVA> -c "select current_user, current_database();"
```

## Estado actual

La conexion desde DBeaver ya fue validada como exitosa con la nueva configuracion (nuevo contenedor, nuevas credenciales y nuevo puerto).

## Error 2: Incompatibilidad de Geth con genesis PoA (Clique)

### Sintoma

- Al inicializar o arrancar el nodo Ethereum local aparecieron errores de arranque.
- Mensaje detectado:
  - `Geth only supports PoS networks. Please transition legacy networks using Geth v1.13.x.`
  - `terminalTotalDifficulty is not set in genesis block`

### Causa

La imagen `ethereum/client-go:stable` (versiones nuevas) ya no es compatible con esta configuracion legacy PoA `clique` usada en el laboratorio.

### Solucion aplicada

1. Corregir `extradata` en `genesis.json` (longitud valida para Clique).
2. Re-inicializar la cadena usando `geth v1.13.x`.
3. Levantar el nodo con la misma version `v1.13.x`.

### Comandos usados

```bash
docker run --rm -v "${PWD}\blockchain:/blockchain" ethereum/client-go:v1.13.15 --datadir /blockchain/data init /blockchain/genesis.json
```

```bash
docker run -d --name eth2 -p 8545:8545 -p 8546:8546 -v "${PWD}\blockchain\data:/data" ethereum/client-go:v1.13.15 --datadir /data --networkid 1337 --http --http.addr 0.0.0.0 --http.port 8545 --http.api eth,net,web3,personal,miner,admin --http.corsdomain "*" --ws --ws.addr 0.0.0.0 --ws.port 8546 --ws.api eth,net,web3,personal,miner,admin --allow-insecure-unlock
```

### Validacion de que quedo resuelto

- Contenedor `eth2` en estado `Up`.
- RPC HTTP activo en `http://localhost:8545`.
- `eth_chainId` responde `0x539` (1337).

## Error 3: Transacciones quedan en `Pending` indefinidamente en MetaMask

### Sintoma

- La transaccion se envia (aparece hash), pero en MetaMask queda en `Pending`.
- Al consultar `eth_getTransactionByHash`, `blockNumber` y `blockHash` salen en `null`.

### Causa principal

El nodo estaba activo, pero **sin minado efectivo**:

- `eth_mining = false`, o
- sin firmante local desbloqueado para Clique (`unknown account` / `etherbase missing`).

### Solucion aplicada

1. Crear cuenta firmante local en el `datadir`.
2. Incluirla como firmante en `genesis.json` (`extradata`).
3. Inicializar nuevamente la cadena con `init`.
4. Levantar Geth con `--unlock`, `--password`, `--mine` y `--miner.etherbase`.

### Validacion

- `eth_mining` devuelve `true`.
- `eth_blockNumber` aumenta con el tiempo.
- `eth_getTransactionReceipt` devuelve `status: 0x1` y `blockNumber` no nulo.

## Error 4: Geth inicia en Mainnet por error y falla al minar

### Sintoma

- Logs de Geth muestran `Chain ID: 1 (mainnet)`.
- Al minar aparece error/panic relacionado con consenso PoS/PoW no compatible.

### Causa

Se arranco Geth sobre un `datadir` no inicializado con el `genesis.json` de la practica.

### Solucion

- Usar un `datadir` limpio.
- Ejecutar primero `init` con el `genesis.json` local.
- Arrancar el nodo solo despues de validar que la cadena es `1337` y consenso `Clique`.

## Error 5: La cuenta no aparece en UI despues de conectar MetaMask

### Sintoma

- El usuario acepta conexion en MetaMask, pero en la app sigue saliendo `No conectada`.

### Causa probable

- Flujo de permisos incompleto, o
- respuesta vacia de `eth_requestAccounts` en ese intento concreto.

### Solucion aplicada en frontend

- Solicitar permisos explicitamente (`wallet_requestPermissions`).
- Luego pedir cuentas (`eth_requestAccounts`).
- Usar respaldo con `eth_accounts` y `selectedAddress` para recuperar cuenta activa.
- Mostrar mensaje de error claro cuando no se detecta cuenta seleccionada.

## Error 6: Intento de pago desde la misma cuenta comercio

### Sintoma

- Se intenta pagar usando la misma cuenta que recibe (`from === to`).

### Solucion aplicada

- Se bloqueo el pago en frontend cuando `from` y `to` son iguales.
- Se muestra mensaje: cambiar de cuenta en MetaMask antes de pagar.

## Error 7: MetaMask muestra "Acelerar" pero no confirma

### Explicacion

- `Acelerar` solo aumenta gas de prioridad para una transaccion ya pendiente.
- Si la red local no mina bloques, subir gas no resuelve el problema.

### Accion correcta

- Primero resolver estado del nodo (firmante + minado), luego reenviar pago.

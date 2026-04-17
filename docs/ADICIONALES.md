# Documentacion Adicional

Este documento concentra los elementos adicionales de la practica.

> Nota: el proyecto principal trabaja con PostgreSQL, pero se dejan comandos de referencia para otros motores.

## 1) Backend local de comprobacion (Express + PostgreSQL)

### Dependencias

```bash
npm install express pg cors dotenv
```

### Scripts disponibles

```bash
npm run server
npm run server:dev
```

### Endpoints implementados

- `GET /health`
- `GET /api/products`
- `GET /api/products?limit=5`
- `GET /api/products?search=chai`
- `GET /api/products/:id`

### Pruebas rapidas

```bash
curl.exe -s "http://localhost:3000/health"
curl.exe -s "http://localhost:3000/api/products?limit=5"
curl.exe -s "http://localhost:3000/api/products/1"
```

### Archivos relacionados

- API: `server/index.js`
- Rest Client: `rest-client/northwind-check.http`

## 2) Scripts adicionales de otros motores

### Scripts guardados

- `db/scripts/others/northwind.mysql.sql`
- `db/scripts/others/northwind.oracle.sql`
- `db/scripts/others/northwind.sqlserver.sql`

### Verificacion rapida de sintaxis

- MySQL: `AUTO_INCREMENT`, backticks (`` ` ``).
- Oracle: `VARCHAR2`, `NUMBER`, `CREATE SEQUENCE`.
- SQL Server: bloques `GO`.

## 3) Comandos de referencia para crear base de datos por motor

## MySQL (Docker)

### Crear contenedor y base

```bash
docker run -d --name mysql-northwind -e MYSQL_ROOT_PASSWORD=<MYSQL_ROOT_PASSWORD> -e MYSQL_DATABASE=northwind -p 3306:3306 mysql:8
```

### Importar script

```bash
docker exec -i mysql-northwind mysql -uroot -p<MYSQL_ROOT_PASSWORD> northwind < db/scripts/others/northwind.mysql.sql
```

## SQL Server (Docker)

### Crear contenedor

```bash
docker run -d --name sqlserver-northwind -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=<SA_PASSWORD_FUERTE>" -p 1433:1433 mcr.microsoft.com/mssql/server:2022-latest
```

### Copiar script al contenedor

```bash
docker cp db/scripts/others/northwind.sqlserver.sql sqlserver-northwind:/tmp/northwind.sql
```

### Crear base e importar script

```bash
docker exec sqlserver-northwind /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "<SA_PASSWORD_FUERTE>" -C -Q "CREATE DATABASE northwind"
docker exec sqlserver-northwind /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "<SA_PASSWORD_FUERTE>" -C -d northwind -i /tmp/northwind.sql
```

## Oracle XE (Docker)

### Crear contenedor

```bash
docker run -d --name oracle-northwind -e ORACLE_PASSWORD=<ORACLE_PASSWORD> -p 1521:1521 gvenzl/oracle-xe:21-slim
```

### Copiar script al contenedor

```bash
docker cp db/scripts/others/northwind.oracle.sql oracle-northwind:/tmp/northwind.sql
```

### Crear usuario/base logica e importar script

```bash
docker exec oracle-northwind sqlplus system/<ORACLE_PASSWORD>@XEPDB1 @/tmp/northwind.sql
```

## 4) Comandos usados para extraer scripts de otros motores

```bash
git clone https://github.com/Jviejo/curso-dbs-14.git
New-Item -ItemType Directory -Path .\db\scripts\others -Force
Copy-Item .\curso-dbs-14\northwind\northwind.mysql.sql .\db\scripts\others\northwind.mysql.sql -Force
Copy-Item .\curso-dbs-14\northwind\northwind.oracle.sql .\db\scripts\others\northwind.oracle.sql -Force
Copy-Item .\curso-dbs-14\northwind\northwind.sqlserver.sql .\db\scripts\others\northwind.sqlserver.sql -Force
Remove-Item .\curso-dbs-14 -Recurse -Force
```

# Resumen de Tecnologias y Componentes

## Frontend

- React 19
- Vite 8
- Bootstrap 5
- React Router DOM
- TanStack React Query
- React Hook Form
- Context API (`useContext`) para estado global de cesta

## Backend

- Node.js + Express
- PostgreSQL (`pg`)
- CORS
- Dotenv

## Blockchain (local)

- Geth (Docker) con red privada
- `genesis.json` para inicializacion
- MetaMask para conexion y firma
- RPC local en `http://localhost:8545`

## Componentes principales

- Layout:
  - `Header`
  - `Footer`
  - `HomeLayout` (`Outlet`)
- Paginas:
  - `HomePage`
  - `ProductPage`
  - `CartPage`
- Contexto:
  - `ShopProvider`
  - `useShop`

## Endpoints usados

- `GET /ping`
- `GET /health`
- `GET /products`
- `GET /api/products`
- `GET /api/products/:id`

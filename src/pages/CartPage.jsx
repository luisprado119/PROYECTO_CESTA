import { useEffect, useState } from 'react'
import { useShop } from '../context/useShop.js'

function toWeiHex(amountEth) {
  const [wholePart, fractionalPart = ''] = String(amountEth).split('.')
  const whole = BigInt(wholePart || '0')
  const fraction = BigInt((fractionalPart.padEnd(18, '0').slice(0, 18) || '0'))
  const wei = whole * 10n ** 18n + fraction
  return `0x${wei.toString(16)}`
}

async function getCuentaActiva(ethereumProvider) {
  const autorizadas = await ethereumProvider.request({ method: 'eth_accounts' })
  const cuentaAutorizada = autorizadas?.[0] || ''
  const cuentaSeleccionada = ethereumProvider.selectedAddress || ''
  return cuentaAutorizada || cuentaSeleccionada || ''
}

function formatCuenta(cuenta) {
  if (!cuenta) return 'No conectada'
  if (cuenta.length < 12) return cuenta
  return `${cuenta.slice(0, 6)}...${cuenta.slice(-4)}`
}

function CartPage() {
  const { estado, totalCesta } = useShop()
  const items = estado.cesta
  const [cuenta, setCuenta] = useState('')
  const [txOk, setTxOk] = useState('')
  const [txRechazo, setTxRechazo] = useState('')
  const [conectando, setConectando] = useState(false)
  const [pagando, setPagando] = useState(false)
  const ethUsdRate = Number(import.meta.env.VITE_ETH_USD_RATE || 3000)

  const merchantAddress =
    import.meta.env.VITE_MERCHANT_ADDRESS ||
    '0xCaB113E18897a870E8489DA9b8EA37fce653dE2D'
  const totalUsd = Number(totalCesta || 0)
  const totalEth = ethUsdRate > 0 ? Number((totalUsd / ethUsdRate).toFixed(8)) : 0

  useEffect(() => {
    const ethereumProvider = window.ethereum
    if (!ethereumProvider) return

    const handleAccountsChanged = (accounts) => {
      const account = accounts?.[0] || ''
      setCuenta(account)
    }

    ethereumProvider.on('accountsChanged', handleAccountsChanged)

    return () => {
      ethereumProvider.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const conectarMetaMask = async () => {
    const ethereumProvider = window.ethereum
    if (!ethereumProvider) {
      setTxRechazo('MetaMask no esta disponible en este navegador.')
      return
    }

    setConectando(true)
    setTxOk('')
    setTxRechazo('')
    try {
      // Paso recomendado: solicitar permisos de cuentas antes de leerlas.
      await ethereumProvider.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      })

      const accounts = await ethereumProvider.request({
        method: 'eth_requestAccounts',
      })
      const account = accounts?.[0] || (await getCuentaActiva(ethereumProvider))
      setCuenta(account)
      if (!account) {
        setTxRechazo(
          'No se detecto una cuenta seleccionada. Marca una cuenta en MetaMask y vuelve a intentar.',
        )
      }
    } catch (error) {
      const message = String(error?.message || '')
      // Fallback para wallets que no implementan wallet_requestPermissions.
      if (message.toLowerCase().includes('wallet_requestpermissions')) {
        try {
          const accounts = await ethereumProvider.request({
            method: 'eth_requestAccounts',
          })
          const account = accounts?.[0] || (await getCuentaActiva(ethereumProvider))
          setCuenta(account)
          if (!account) {
            setTxRechazo(
              'No se detecto una cuenta seleccionada. Marca una cuenta en MetaMask y vuelve a intentar.',
            )
          }
        } catch (fallbackError) {
          setTxRechazo(
            fallbackError.message || 'El usuario cancelo la conexion.',
          )
        }
      } else {
        setTxRechazo(message || 'El usuario cancelo la conexion.')
      }
    } finally {
      setConectando(false)
    }
  }

  const pagar = async () => {
    const ethereumProvider = window.ethereum
    setTxOk('')
    setTxRechazo('')

    if (!ethereumProvider) {
      setTxRechazo('MetaMask no esta disponible.')
      return
    }
    if (!cuenta) {
      setTxRechazo('Primero debes conectar MetaMask.')
      return
    }
    if (totalCesta <= 0) {
      setTxRechazo('No hay importe para pagar en la cesta.')
      return
    }
    if (ethUsdRate <= 0) {
      setTxRechazo('La tasa USD/ETH no es valida. Revisa VITE_ETH_USD_RATE.')
      return
    }
    if (totalEth <= 0) {
      setTxRechazo('El importe convertido a ETH es 0. Ajusta la tasa USD/ETH.')
      return
    }
    if (cuenta.toLowerCase() === merchantAddress.toLowerCase()) {
      setTxRechazo(
        'La cuenta conectada es la misma cuenta comercio. Cambia de cuenta en MetaMask para poder pagar.',
      )
      return
    }

    const transactionParameters = {
      to: merchantAddress,
      from: cuenta,
      value: toWeiHex(totalEth),
      gas: '0x5208',
    }

    setPagando(true)
    try {
      const txHash = await ethereumProvider.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      })
      setTxOk(txHash)
    } catch (error) {
      const message = String(error?.message || '')
      if (message.toLowerCase().includes('insufficient funds')) {
        setTxRechazo(
          'Fondos insuficientes para cubrir el pago + gas. Prueba con menor total o mas saldo.',
        )
      } else {
        setTxRechazo(message || 'Transaccion cancelada o fallida.')
      }
    } finally {
      setPagando(false)
    }
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <h2>Cesta</h2>
        <p>Revisa cantidades, total en USD y conversion a ETH antes de pagar.</p>
      </div>

      <table className="cart-table table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 && (
            <tr>
              <td colSpan="5">No hay productos en la cesta.</td>
            </tr>
          )}
          {items.map((item) => (
            <tr key={item.producto.id}>
              <td>{item.producto.id}</td>
              <td>{item.producto.name}</td>
              <td>{item.cantidad}</td>
              <td>${item.producto.price}</td>
              <td>${item.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="cart-summary">
        <p className="total">Total USD: ${totalUsd}</p>
        <p className="mb-2">Tasa de conversion: 1 ETH = ${ethUsdRate}</p>
        <p className="mb-0">Total a pagar en ETH: {totalEth} ETH</p>
      </div>

      <div className="wallet-box">
        <p className="wallet-title">Conectar MetaMask</p>
        <p>Cuenta: {formatCuenta(cuenta)}</p>
        <div className="d-flex gap-2 flex-wrap">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={conectarMetaMask}
            disabled={conectando}
          >
            {conectando ? 'Conectando...' : 'Conectar MetaMask'}
          </button>
          <button
            type="button"
            className="btn btn-success"
            onClick={pagar}
            disabled={pagando}
          >
            {pagando ? 'Procesando...' : 'Pagar'}
          </button>
        </div>
      </div>

      {txOk && (
        <div className="alert alert-success mt-3" role="alert">
          Transaccion enviada correctamente. Hash: {txOk}
        </div>
      )}

      {txRechazo && (
        <div className="alert alert-danger mt-3" role="alert">
          {txRechazo}
        </div>
      )}
    </section>
  )
}

export default CartPage

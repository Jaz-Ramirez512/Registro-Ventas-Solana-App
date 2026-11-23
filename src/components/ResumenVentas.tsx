import { UNIDAD_MONTO } from '../config/interfaz';
import type { RegistroUI } from '../solana/lecturas';
import { calcularResumen } from '../solana/resumen';

const formato = (n: number) => n.toLocaleString('es-MX');

export function ResumenVentas({ registro }: { registro: RegistroUI }) {
  const r = calcularResumen(registro);
  const maximo = r.ranking.length > 0 ? r.ranking[0].total : 0;

  return (
    <section className="panel summary-panel">
      <div className="panel-heading">
        <h3>Resumen de ventas</h3>
        <span className="small-note">Calculado desde las cuentas en Devnet</span>
      </div>

      {r.numeroVentas === 0 ? (
        <p className="empty-line">
          Todavía no hay ventas activas. Registra una venta para ver aquí tus indicadores.
        </p>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="label">Total vendido</span>
              <strong>{formato(r.totalVendido)} <small>{UNIDAD_MONTO}</small></strong>
            </div>
            <div className="stat-card">
              <span className="label">Ventas activas</span>
              <strong>{formato(r.numeroVentas)}</strong>
            </div>
            <div className="stat-card">
              <span className="label">Ticket promedio</span>
              <strong>{formato(r.ticketPromedio)} <small>{UNIDAD_MONTO}</small></strong>
            </div>
            <div className="stat-card">
              <span className="label">Clientes con compras</span>
              <strong>{r.clientesConVentas} de {r.numeroClientes}</strong>
            </div>
          </div>

          <div className="highlight-row">
            {r.mejorCliente && (
              <div className="highlight">
                <span className="label">Mejor cliente</span>
                <strong>{r.mejorCliente.nombre}</strong>
                <span className="small-note">
                  {formato(r.mejorCliente.total)} {UNIDAD_MONTO} en {r.mejorCliente.ventas} ventas
                </span>
              </div>
            )}
            {r.ventaMasAlta && (
              <div className="highlight">
                <span className="label">Venta más alta</span>
                <strong>{r.ventaMasAlta.descripcion}</strong>
                <span className="small-note">
                  {formato(r.ventaMasAlta.monto)} {UNIDAD_MONTO} · {r.ventaMasAlta.cliente} · <code>{r.ventaMasAlta.sku}</code>
                </span>
              </div>
            )}
          </div>

          <h4 className="ranking-title">Ranking de clientes</h4>
          <div className="ranking">
            {r.ranking.map((c) => (
              <div className="ranking-row" key={c.idCliente}>
                <div className="ranking-info">
                  <strong>{c.nombre}</strong>
                  <span className="small-note">{c.ventas} ventas</span>
                </div>
                <div className="ranking-bar">
                  <div
                    className="ranking-fill"
                    style={{ width: maximo > 0 ? `${Math.round((c.total / maximo) * 100)}%` : '0%' }}
                  />
                </div>
                <span className="ranking-total">{formato(c.total)} <small>{UNIDAD_MONTO}</small></span>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
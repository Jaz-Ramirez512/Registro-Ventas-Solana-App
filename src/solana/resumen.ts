import type { RegistroUI } from "./lecturas";

/*
RESUMEN DE VENTAS: mejora propia del proyecto.

Calcula indicadores de negocio a partir de lo que ya lee la app desde la
cadena (RegistroUI). No firma ni escribe nada: solo transforma datos.
*/

export type RankingCliente = {
  idCliente: number;
  nombre: string;
  total: number;
  ventas: number;
};

export type ResumenVentas = {
  totalVendido: number;
  numeroVentas: number;
  ticketPromedio: number;
  numeroClientes: number;
  clientesConVentas: number;
  mejorCliente: RankingCliente | null;
  ventaMasAlta: {
    sku: string;
    descripcion: string;
    monto: number;
    cliente: string;
  } | null;
  ranking: RankingCliente[];
};

export function calcularResumen(registro: RegistroUI): ResumenVentas {
  const ranking: RankingCliente[] = registro.clientes.map((c) => ({
    idCliente: c.idCliente,
    nombre: c.nombre,
    total: c.ventas.reduce((suma, v) => suma + v.monto, 0),
    ventas: c.ventas.length,
  }));

  ranking.sort((a, b) => b.total - a.total);

  const totalVendido = ranking.reduce((suma, c) => suma + c.total, 0);
  const numeroVentas = ranking.reduce((suma, c) => suma + c.ventas, 0);
  const clientesConVentas = ranking.filter((c) => c.ventas > 0).length;

  let ventaMasAlta: ResumenVentas["ventaMasAlta"] = null;
  for (const c of registro.clientes) {
    for (const v of c.ventas) {
      if (ventaMasAlta === null || v.monto > ventaMasAlta.monto) {
        ventaMasAlta = {
          sku: v.sku,
          descripcion: v.descripcion,
          monto: v.monto,
          cliente: c.nombre,
        };
      }
    }
  }

  return {
    totalVendido,
    numeroVentas,
    ticketPromedio: numeroVentas > 0 ? Math.round(totalVendido / numeroVentas) : 0,
    numeroClientes: registro.clientes.length,
    clientesConVentas,
    mejorCliente: numeroVentas > 0 ? ranking[0] : null,
    ventaMasAlta,
    ranking,
  };
}
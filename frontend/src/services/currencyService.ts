import axios from "axios";

const baseUrl = import.meta.env.VITE_API_BASE_BANCO_CENTRAL_BRASIL;

export type DollarQuote = {
  cotacaoCompra: number;
  cotacaoVenda: number;
  dataHoraCotacao: string;
};

export function getTodayFormatted() {
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const year = today.getFullYear();

  return `${month}-${day}-${year}`;
}

export async function getDollarQuote(): Promise<DollarQuote | null> {
  const query = `?@dataCotacao='${getTodayFormatted()}'&$format=json`;
  const url = `${baseUrl}/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarDia(dataCotacao=@dataCotacao)${query}`;
  console.log(url);
  try {
    const response = await axios.get(url);
    return response.data?.value[0] || null;
  } catch {
    return null;
  }
}

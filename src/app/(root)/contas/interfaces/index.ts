export enum EContaStatus {
  PENDENTE = "PENDENTE",
  PAGO = "PAGO",
  ATRASADO = "ATRASADO",
  PARCIAL = "PARCIAL",
}

export enum EContaTipo {
  FIXA = "FIXA",
  VARIAVEL = "VARIAVEL",
  PARCELADA = "PARCELADA",
  RECORRENTE = "RECORRENTE",
}

export enum EContaMoeda {
  REAL = "REAL",
  DOLAR = "DOLAR",
  EURO = "EURO",
}

export enum EFrequencia {
  DIARIA = "DIARIA",
  SEMANAL = "SEMANAL",
  MENSAL = "MENSAL",
  ANUAL = "ANUAL",
}

export enum EFormaPagamento {
  PIX = "PIX",
  CARTAO = "CARTAO",
  DINHEIRO = "DINHEIRO",
  TRANSFERENCIA = "TRANSFERENCIA",
}

export interface IPagamento {
  data: Date;
  forma: EFormaPagamento;
  observacao?: string;
}
export interface IParcela {
  numero: number;
  valor: number;
  vencimento: Date;
  dataVencimento: string | Date;
  status: EContaStatus;
  pagamento?: IPagamento;
}

export interface IRecorrencia {
  frequencia: EFrequencia;
  diaReferencia?: number; // ex.: dia do mês
}

export interface IContaDTO {
  codigo: string;
  user: any;
  descricao: string;
  categoria: string;
  valor_total: number;
  moeda: string;
  recorrencia?: IRecorrencia;
  data_vencimento: string | Date;
  status: EContaStatus;
  tipo: EContaTipo;
  notas?: string;
  tags?: string[];
  parcelas?: IParcela[];
  created_by?: string | null;
  updated_by?: string | null;
}

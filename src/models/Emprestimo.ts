export interface IEmprestimo {
  id?: number;
  livro_id: number;
  cliente_id: number;
  data_emprestimo?: string;
  data_devolucao?: string | null;
  status?: string;
}

export class Emprestimo implements IEmprestimo {
  constructor(
    public livro_id: number,
    public cliente_id: number,
    public status: string = 'ATIVO',
    public data_emprestimo?: string,
    public data_devolucao?: string | null,
    public id?: number
  ) {}
}
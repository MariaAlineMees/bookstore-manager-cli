export interface ILivro {
  id?: number;
  titulo: string;
  ano_publicacao?: number;
  quantidade_disponivel: number;
  autor_id: number;
}

export class Livro implements ILivro {
  constructor(
    public titulo: string,
    public autor_id: number,
    public quantidade_disponivel: number = 1,
    public ano_publicacao?: number,
    public id?: number
  ) {}
}
export interface IAutor {
  id?: number;
  nome: string;
  nacionalidade?: string;
  data_nascimento?: string;
}

export class Autor implements IAutor {
  constructor(
    public nome: string,
    public nacionalidade?: string,
    public data_nascimento?: string,
    public id?: number
  ) {}
}
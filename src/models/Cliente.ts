export interface ICliente {
  id?: number;
  nome: string;
  email: string;
  telefone?: string;
}

export class Cliente implements ICliente {
  constructor(
    public nome: string,
    public email: string,
    public telefone?: string,
    public id?: number
  ) {}
}
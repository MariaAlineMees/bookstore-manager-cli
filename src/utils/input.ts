import * as readline from 'readline';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const perguntar = (pergunta: string): Promise<string> => {
  return new Promise((resolve) => rl.question(pergunta, resolve));
};

export const fecharEntrada = (): void => {
  rl.close();
};
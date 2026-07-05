import { initDatabase } from './database/connection';

async function main() {
  console.log("🚀 Iniciando BookStore Manager CLI...");
  await initDatabase();
}

main();
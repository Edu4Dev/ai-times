// Core Name: Milton's Core
// Repo URI: https://github.com/schindyguy/ht
// Description: PreSync blog core
// Author: Milton Bolonha
const { createJsonAllMDFiles } = require("./src/lib/sync-lib");

try {
  // Read the existing data from the JSON file
  // Executa as funções de criação de JSON e sincronização de arquivos
  // xxxx criar contador de progresso
  // ## STEP 01: create json from all md files
  createJsonAllMDFiles();
  // Send a success response
  console.log("✔️ [MD to JSON] - End");
} catch (error) {
  console.log("❌ [MD to JSON] - ERROR!");
}

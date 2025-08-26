// import { test, expect } from "playwright/test";
// import b4a from "b4a";

// test("should derive a valid address from a public key", async ({ page }) => {
//   // 1. Carregue o bundle que você acabou de criar
//   await page.goto("about:blank"); // Inicia uma página em branco
//   await page.addScriptTag({ path: "./dist/bundle.js" });

//   // 2. Gere o par de chaves usando o módulo empacotado
//   const keyPairResult = await page.evaluate(() => {
//     // Acesse suas funções através do objeto global que você definiu no Vite
//     const { publicKey, secretKey, mnemonic } = window.MyCryptoLib.generate("trac");
//     return {
//       publicKey: Array.from(publicKey), // Converte o Buffer em Array
//     };
//   });

//   // 3. Converte a chave pública de volta para Buffer
//   const publicKeyInNode = b4a.from(keyPairResult.publicKey);

//   // 4. Teste a sua função de decodificação
//   await page.evaluate((pubKey) => {
//     // Use a função de decodificação para ter certeza que o endereço é válido
//     const address = window.MyCryptoLib.encode("trac", pubKey);
//     const decodedBuffer = window.MyCryptoLib.decode(address);

//     // Certifique-se que o buffer decodificado é o mesmo que o original
//     return window.MyCryptoLib.equals(pubKey, decodedBuffer); // Use o método .equals
//   }, publicKeyInNode);

//   // 5. Verifique o resultado final
//   // O seu teste agora verifica se o processo de codificação/decodificação funciona
//   // e se o tamanho do buffer é o esperado
//   const isBuffer = b4a.isBuffer(publicKeyInNode);
//   expect(isBuffer).toBe(true);
//   expect(publicKeyInNode.length).toBe(32);
// });
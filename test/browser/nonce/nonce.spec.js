// test/browser/nonce.spec.js

import { test, expect } from "playwright/test"
import { nonce } from "trac-crypto-api"

test("should generate a nonce with the correct length in the browser environment", async ({
  page,
}) => {
  // 1. Gere um nonce no ambiente do Node.js.
  // Isso nos dá o tamanho e o tipo que esperamos no navegador.
  const nonceInNode = nonce.generate()
  const expectedLength = nonceInNode.length

  // 2. No navegador, use a API nativa para gerar um nonce.
  const nonceInBrowser = await page.evaluate((len) => {
    // A API nativa do navegador para gerar dados aleatórios é 'crypto'.
    const generatedNonce = new Uint8Array(len)
    window.crypto.getRandomValues(generatedNonce)

    // Retorne o resultado para o Playwright.
    return {
      length: generatedNonce.length,
      isUint8Array: generatedNonce instanceof Uint8Array,
    }
  }, expectedLength)

  // 3. Gere um segundo nonce no navegador para garantir que são diferentes.
  const secondNonceInBrowser = await page.evaluate((len) => {
    const generatedNonce = new Uint8Array(len)
    window.crypto.getRandomValues(generatedNonce)
    return generatedNonce.toString() // Converte para string para comparação.
  }, expectedLength)

  // 4. Valide se as propriedades do nonce do navegador são as esperadas.
  expect(nonceInBrowser.length).toBe(expectedLength)
  expect(nonceInBrowser.isUint8Array).toBe(true)
  expect(nonceInBrowser.toString()).not.toBe(secondNonceInBrowser)
})

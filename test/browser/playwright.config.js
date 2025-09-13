// playwright.config.js
// @ts-check
import { defineConfig } from "playwright/test"

export default defineConfig({
  // Diretório onde os arquivos de teste estão.
  testDir: "./",

  // Configuração para ambientes de teste.
  use: {
    // Modo headless (sem interface gráfica).
    headless: true,
    // Use o Chromium para o teste.
    browserName: "chromium",
  },

  // Garante que o Playwright use os Módulos ES.
  // IMPORTANTE: Isso resolve o 'Cannot find package'
  fullyParallel: true,
  reporter: "list",
})

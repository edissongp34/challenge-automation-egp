import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Las pruebas API y web están organizadas dentro del directorio tests.
  testDir: './tests',
  fullyParallel: true,
  // Se muestran resultados en consola y se genera un reporte HTML navegable.
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  use: {
    // Guarda evidencia de diagnóstico al fallar, sin generar videos para cada éxito.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});

import { createHash } from 'node:crypto';
import { test as base, expect } from '@playwright/test';

type TestFixtures = {
  secretAndLifecycleLog: void;
};

// Selecciona la clave del ambiente configurado y falla temprano si falta configuración.
function getSecretForEnvironment(): { environment: 'QA' | 'CERT'; secret: string } {
  const environment = process.env.TEST_ENV?.trim().toUpperCase();

  if (environment !== 'QA' && environment !== 'CERT') {
    throw new Error('TEST_ENV debe ser QA o CERT.');
  }

  const secretVariable = environment === 'QA' ? 'QA_SECRET' : 'CERT_SECRET';
  const secret = process.env[secretVariable];

  if (!secret) {
    throw new Error(`Define ${secretVariable} en el archivo .env.`);
  }

  return { environment, secret };
}

export const test = base.extend<TestFixtures>({
  // Fixture automático: Playwright lo ejecuta antes y después de cada test sin beforeEach.
  secretAndLifecycleLog: [
    async ({}, use, testInfo) => {
      const { environment, secret } = getSecretForEnvironment();

      // Se registra solo el SHA-256; la clave original nunca se imprime.
      const encryptedSecret = createHash('sha256').update(secret).digest('hex');

      console.log(`Clave encriptada (${environment}): ${encryptedSecret}`);

      try {
        // Aquí Playwright ejecuta el test que solicitó el fixture.
        await use();
      } finally {
        // finally garantiza la fecha de finalización también cuando el test falla.
        console.log(
          `Finalización del test "${testInfo.title}": ${new Date().toISOString()}`,
        );
      }
    },
    { auto: true },
  ],
});

export { expect };

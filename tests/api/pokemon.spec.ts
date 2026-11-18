import type { APIResponse } from '@playwright/test';
import {
  PokemonApi,
  type PokemonResponse,
} from '../../src/api/pokemon-api.js';
import { loadPokemonTestData } from '../../src/data/pokemon-test-data.js';
import { test, expect } from '../fixtures/test.js';

// Cada fila del Excel se convierte en un caso de prueba
// para consultar por ID y por nombre.
const pokemonCases = await loadPokemonTestData();

// Reúne las validaciones comunes para que las consultas por ID y nombre
// comprueben exactamente el mismo comportamiento.
async function assertPokemonResponse(
    response: APIResponse,
    expected: { id: number; name: string },
    identifier: string,
): Promise<void> {
  const status = response.status();

  expect(
      status,
      `GET Pokémon por ${identifier} debe responder 200`,
  ).toBe(200);

  const pokemon =
      (await response.json()) as PokemonResponse;

  expect(pokemon.id).toBe(expected.id);
  expect(pokemon.name).toBe(expected.name);

  // Validación de abilities.
  expect(pokemon.abilities.length).toBeGreaterThan(0);

  for (const entry of pokemon.abilities) {
    expect(entry.ability.name)
        .toEqual(expect.any(String));

    expect(entry.ability.url)
        .toEqual(expect.any(String));

    expect(typeof entry.is_hidden)
        .toBe('boolean');

    expect(entry.slot)
        .toEqual(expect.any(Number));
  }
}

test.describe('GET /pokemon', () => {
  for (const pokemonCase of pokemonCases) {
    test(
        `Validar Pokémon ${pokemonCase.name} por ID y nombre`,
        async ({ request }) => {
          const pokemonApi = new PokemonApi(request);

          await test.step(
              `Consultar Pokémon por ID ${pokemonCase.id}`,
              async () => {
                const startedAt = performance.now();

                const byIdResponse =
                    await pokemonApi.getById(
                        pokemonCase.id,
                    );

                const elapsedTime =
                    performance.now() - startedAt;

                expect(
                    elapsedTime,
                    `La consulta por ID debe responder antes de 10 segundos`,
                ).toBeLessThan(10_000);

                await assertPokemonResponse(
                    byIdResponse,
                    pokemonCase,
                    `ID ${pokemonCase.id}`,
                );
              },
          );

          await test.step(
              `Consultar Pokémon por nombre ${pokemonCase.name}`,
              async () => {
                const startedAt = performance.now();

                const byNameResponse =
                    await pokemonApi.getByName(
                        pokemonCase.name,
                    );

                const elapsedTime =
                    performance.now() - startedAt;

                expect(
                    elapsedTime,
                    `La consulta por nombre debe responder antes de 10 segundos`,
                ).toBeLessThan(10_000);

                await assertPokemonResponse(
                    byNameResponse,
                    pokemonCase,
                    `nombre ${pokemonCase.name}`,
                );
              },
          );
        },
    );
  }
});

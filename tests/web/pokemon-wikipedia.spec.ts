import { PokemonWikipediaPage } from '../../src/pages/pokemon-wikipedia.page.js';
import { loadPokemonTestData } from '../../src/data/pokemon-test-data.js';
import { test } from '../fixtures/test.js';

// Se reutilizan directamente los nombres leídos desde Datos-pruebas.xlsx.
const pokemonCases = await loadPokemonTestData();

test.describe('Página web de Pokémon en Wikipedia', () => {
  // Genera un test independiente por cada Pokémon; el fixture común registra secretos y tiempos.
  for (const pokemonCase of pokemonCases) {
    test(`Validar la página y descarga la imagen de ${pokemonCase.name}`, async ({ page }) => {
      const pokemonPage = new PokemonWikipediaPage(page);

      // Cada bloque aparece como un paso independiente en la consola y en el reporte HTML.
      await test.step(`Abrir el artículo de ${pokemonCase.name}`, async () => {
        await pokemonPage.open(pokemonCase.name);
      });

      await test.step(`Validar el título del artículo de ${pokemonCase.name}`, async () => {
        await pokemonPage.assertTitle(pokemonCase.name);
      });

      await test.step(`Registrar quién realizó la ilustración de ${pokemonCase.name}`, async () => {
        await pokemonPage.logIllustrationArtist(pokemonCase.name);
      });

      await test.step(`Descargar y validar la imagen de ${pokemonCase.name}`, async () => {
        await pokemonPage.downloadInfoboxImage(pokemonCase.name);
      });
    });
  }
});

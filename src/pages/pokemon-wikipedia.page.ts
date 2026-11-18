import { mkdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { expect, type Locator, type Page } from '@playwright/test';

// Page Object Model: mantiene en una sola clase los selectores y acciones de Wikipedia.
export class PokemonWikipediaPage {
  private readonly heading: Locator;
  private readonly infobox: Locator;

  constructor(private readonly page: Page) {
    // El título y la tabla informativa contienen los elementos que valida el reto.
    this.heading = page.locator('#firstHeading');
    this.infobox = page.locator('table.infobox');
  }

  async open(pokemonName: string): Promise<void> {
    // Codifica el nombre para formar una ruta válida incluso si contiene espacios o acentos.
    const articlePath = `/wiki/${encodeURIComponent(pokemonName)}`;
    await this.page.goto(new URL(articlePath, 'https://en.wikipedia.org').toString());
  }

  async assertTitle(pokemonName: string): Promise<void> {
    // Comprueba que Wikipedia abrió el artículo del Pokémon y no una lista o desambiguación.
    const headingText = (await this.heading.innerText()).trim();
    expect(headingText.toLowerCase()).toBe(pokemonName.toLowerCase());
  }

  async logIllustrationArtist(pokemonName: string): Promise<void> {
    // La leyenda del infobox contiene el crédito de la ilustración.
    const caption = this.infobox.locator('.infobox-caption').first();
    await expect(caption, `Wikipedia debe mostrar el crédito de ${pokemonName}`).toBeVisible();
    const creditText = (await caption.innerText()).trim();
    expect(creditText).not.toBe('');
    console.log(`Crédito de la ilustración de ${pokemonName}: ${creditText}`);
  }
  async downloadInfoboxImage(pokemonName: string): Promise<string> {
    const image = this.infobox.locator('img').first();

    await expect(
        image,
        `Wikipedia debe mostrar la imagen de ${pokemonName}`
    ).toBeVisible();

    // Interacción con el elemento web antes de obtener
    // la URL de la imagen mostrada en pantalla.
    await image.click();

    const imageUrl = await image.evaluate(
        (element: HTMLImageElement) =>
            element.currentSrc || element.src
    );

    // La descarga se realiza utilizando la URL obtenida
    // dinámicamente desde el elemento renderizado.
    const response = await this.page.request.get(imageUrl);

    expect(
        response.ok(),
        `La imagen de ${pokemonName} debe poder descargarse`
    ).toBeTruthy();

    // Validación de extensión
    const imagePath = new URL(imageUrl).pathname;
    const extension = path
        .extname(decodeURIComponent(imagePath))
        .toLowerCase();

    expect([
      '.jpg',
      '.jpeg',
      '.png',
      '.svg'
    ]).toContain(extension);

    // Creación automática del directorio
    const imagesDirectory = path.resolve(
        process.cwd(),
        'images'
    );

    await mkdir(imagesDirectory, {
      recursive: true,
    });

    // Sobrescribe el archivo si ya existe
    const filePath = path.join(
        imagesDirectory,
        `${pokemonName}${extension}`
    );

    await writeFile(
        filePath,
        await response.body()
    );

    // Validación del tamaño del archivo
    const fileSize = (
        await stat(filePath)
    ).size;

    expect(fileSize).toBeLessThan(500_000);

    console.log(
        `Imagen guardada: ${filePath} (${fileSize} bytes)`
    );

    return filePath;
  }
}

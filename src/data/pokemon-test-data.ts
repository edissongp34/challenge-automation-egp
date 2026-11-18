import ExcelJS from 'exceljs';
import path from 'node:path';

export interface PokemonTestCase {
  id: number;
  name: string;
}

// Normaliza celdas de Excel que pueden venir como texto, número o hipervínculo.
function getCellText(value: ExcelJS.CellValue): string {
  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim();
  }

  if (value && typeof value === 'object' && 'text' in value) {
    return String(value.text).trim();
  }

  return '';
}

// Lee y valida los casos del Excel para generar las pruebas dinámicamente.
export async function loadPokemonTestData(): Promise<PokemonTestCase[]> {
  const filePath = path.resolve(process.cwd(), 'Datos-pruebas.xlsx');
  const workbook = new ExcelJS.Workbook();

  try {
    await workbook.xlsx.readFile(filePath);
  } catch (error) {
    throw new Error(
      `No se pudo leer "${filePath}". Agrega el archivo Datos-pruebas.xlsx en la raíz del proyecto.`,
      { cause: error },
    );
  }

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error('Datos-pruebas.xlsx no contiene ninguna hoja.');
  }

  // Busca las columnas por nombre para no depender de su orden en la hoja.
  const headers = worksheet.getRow(1).values as ExcelJS.CellValue[];
  const normalizedHeaders = headers.map((header) => getCellText(header).toLowerCase());
  const idColumn = normalizedHeaders.findIndex((header) => header === 'id');
  const nameColumn = normalizedHeaders.findIndex(
    (header) => header === 'name' || header === 'nombre',
  );

  if (idColumn < 1 || nameColumn < 1) {
    throw new Error(
      'La primera fila de Datos-pruebas.xlsx debe incluir las columnas "id" y "nombre" o "name".',
    );
  }

  const testCases: PokemonTestCase[] = [];
  // La fila 1 es la cabecera; las filas vacías se omiten y las incompletas se rechazan.
  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber += 1) {
    const row = worksheet.getRow(rowNumber);
    const idText = getCellText(row.getCell(idColumn).value);
    const name = getCellText(row.getCell(nameColumn).value).toLowerCase();

    if (!idText && !name) {
      continue;
    }

    const id = Number(idText);
    if (!Number.isInteger(id) || id <= 0 || !name) {
      throw new Error(
        `La fila ${rowNumber} de Datos-pruebas.xlsx debe tener un ID positivo y un nombre.`,
      );
    }

    testCases.push({ id, name });
  }

  if (testCases.length === 0) {
    throw new Error('Datos-pruebas.xlsx no contiene casos de prueba después de la cabecera.');
  }

  return testCases;
}

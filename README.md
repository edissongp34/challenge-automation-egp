# Challenge Automation \- EGP

## Descripción

Automatización desarrollada con **Playwright \+ TypeScript** para la resolución del challenge técnico de Monnet Payments.

El proyecto implementa pruebas API y Web aplicando buenas prácticas de automatización, patrones de diseño, manejo de múltiples ambientes, lectura dinámica de datos desde Excel, uso de fixtures personalizadas y generación de evidencias para análisis de fallas.

---

# Tecnologías utilizadas

- Playwright
- TypeScript
- Node.js
- ExcelJS
- Dotenv
- Crypto (SHA\-256)

---

# Arquitectura

El framework fue diseñado siguiendo principios de mantenibilidad, reutilización y escalabilidad.

## Patrones utilizados

- Page Object Model (POM)
- Service Layer Pattern
- Custom Fixtures
- Separation of Concerns
- Data Driven Testing

---

# Estructura del proyecto

.

├── src

│   ├── api

│   │   ├── pokemon\-api.ts

│   │   └── posts\-api.ts

│   │

│   ├── data

│   │   └── pokemon\-test\-data.ts

│   │

│   └── pages

│       └── pokemon\-wikipedia.page.ts

│

├── tests

│   ├── api

│   │   ├── pokemon.spec.ts

│   │   └── posts.spec.ts

│   │

│   ├── fixtures

│   │   └── test.ts

│   │

│   └── web

│       └── pokemon\-wikipedia.spec.ts

│

├── playwright\-report

├── test\-results

│

├── .env.example

├── .gitignore

├── Datos\-pruebas.xlsx

├── package.json

└── README.md

### Descripción de carpetas

| Carpeta / Archivo | Descripción |
| --- | --- |
| src/api | Clientes API utilizados para consumir los endpoints del challenge. |
| src/data | Lectura y validación de datos provenientes de Datos\-pruebas.xlsx. |
| src/pages | Implementación del patrón Page Object Model para las pruebas Web. |
| tests/api | Casos de prueba de APIs. |
| tests/web | Casos de prueba de interfaz web. |
| tests/fixtures | Fixtures personalizadas para manejo de ambientes y ciclo de vida de los tests. |
| playwright\-report | Reporte HTML generado por Playwright. |
| test\-results | Evidencias de ejecución (traces, screenshots, videos y logs). |
| Datos\-pruebas.xlsx | Fuente de datos utilizada para generar pruebas dinámicamente. |

---

# Prerrequisitos

Instalar previamente:

- Node.js LTS
- npm

Validar instalación:

node \-\-version

npm \-\-version

---

# Instalación

Instalar dependencias del proyecto:

npm install

Instalar navegadores de Playwright:

npx playwright install chromium

---

# Configuración de Ambientes

El framework soporta múltiples ambientes.

Actualmente se encuentran configurados:

- QA
- CERT

Crear un archivo .env tomando como base .env.example.

Ejemplo:

TEST\_ENV=QA

QA\_SECRET=xxxxxxxxxxxxxxxx

CERT\_SECRET=xxxxxxxxxxxxxxxx

## Seguridad

Las claves secretas no se exponen dentro del código fuente.

Antes de cada ejecución:

1. Se obtiene la clave correspondiente al ambiente configurado.
2. Se genera el hash SHA\-256.
3. Se registra únicamente el valor encriptado.
4. Se registra la fecha y hora de finalización del test.
5. La clave original nunca es mostrada.

La implementación utiliza Fixtures de Playwright, cumpliendo con el requerimiento de no utilizar hooks beforeEach.

---

# Datos de Prueba

Las pruebas consumen datos desde:

Datos\-pruebas.xlsx

El archivo debe ubicarse en la raíz del proyecto.

Ejemplo de estructura:

| id | nombre |
| --- | --- |
| 1 | bulbasaur |
| 2 | ivysaur |
| 3 | venusaur |

Cada fila representa un caso de prueba independiente.

Los datos son leídos dinámicamente durante la ejecución, evitando hardcodear información dentro de los tests.

Validaciones implementadas:

- Existencia del archivo.
- Existencia de hoja de datos.
- Validación de encabezados.
- Validación de IDs.
- Validación de nombres.
- Omisión de filas vacías.

---

# Suite API

## Endpoint Pokémon

Endpoint evaluado:

GET [https://pokeapi.co/api/v2/pokemon/\{id](https://pokeapi.co/api/v2/pokemon/{id) o name\}

### Validaciones realizadas

- Status Code 200.
- Validación de ID.
- Validación de nombre.
- Validación de habilidades (abilities).
- Validación de estructura de abilities.
- Consulta por ID.
- Consulta por nombre.
- Tiempo de respuesta menor a 10 segundos.

### Datos validados

- id
- name
- abilities[].ability.name
- abilities[].ability.url
- abilities[].is\_hidden
- abilities[].slot

### Adicionalmente

- Log de clave encriptada.
- Log de fecha y hora de finalización.
- Visualización de pasos mediante test.step() en el reporte HTML.

---

## Endpoint JSON Placeholder

Endpoint evaluado:

POST [https://jsonplaceholder.typicode.com/posts](https://jsonplaceholder.typicode.com/posts)

### Validaciones realizadas

- Status Code.
- Body de respuesta.
- Datos enviados.
- Identificador generado.
- Tiempo de respuesta menor a 10 segundos.

### Adicionalmente

- Log de clave encriptada.
- Log de fecha y hora de finalización.

---

# Suite Web

Para cada Pokémon informado en el archivo Excel:

1. Navega al artículo correspondiente en Wikipedia.
2. Valida el título del artículo.
3. Obtiene y registra el crédito de la ilustración.
4. Descarga la imagen asociada.
5. Valida el archivo descargado.
6. Genera evidencias de ejecución.

La automatización utiliza el patrón Page Object Model para encapsular selectores y acciones de la aplicación.

## Validaciones realizadas

### Artículo

- Existencia del artículo.
- Validación del título.
- Validación de información de la ilustración.

### Imagen

La URL de la imagen se obtiene dinámicamente desde el elemento renderizado por Wikipedia después de interactuar con él, evitando hardcodear rutas o archivos.

Validaciones:

- Extensión permitida:
  - jpg
  - jpeg
  - png
  - svg
- Validación case insensitive.
- Tamaño menor a 500000 bytes.
- Sobrescritura automática en ejecuciones posteriores.

---

# Evidencias

Para facilitar el análisis de fallas se encuentran habilitadas las siguientes evidencias:

- Screenshots.
- Videos.
- Traces.
- Logs.

Las evidencias se almacenan en:

test\-results

Las pruebas utilizan test.step() para documentar cada acción relevante dentro del reporte HTML, facilitando la lectura, trazabilidad y análisis de fallos.

---

# Ejecución

Ejecutar toda la suite:

npm test

Ejecutar únicamente pruebas API:

npm run test:api

Ejecutar únicamente pruebas Web:

npm run test:web

Validar TypeScript:

npm run typecheck

---

# Reportes

Una vez finalizada la ejecución:

npx playwright show\-report

o

npm run test:report

El reporte HTML será generado en:

playwright\-report

Abrir el archivo index.html para revisar el detalle de ejecución, evidencias y pasos registrados.

---

# Consideraciones

- Se evita la duplicación de código.
- Los datos son obtenidos dinámicamente desde Excel.
- Se utilizan Fixtures para funcionalidades transversales.
- Las claves secretas no son visibles dentro del código.
- Se implementó Page Object Model para la automatización Web.
- Se implementó Service Layer para la automatización API.
- Se utilizan test.step() para mejorar la trazabilidad de las ejecuciones.
- El framework fue diseñado para ser reutilizable, escalable y de fácil mantenimiento.

---

# Autor

**Edisson Gómez Pinzón**


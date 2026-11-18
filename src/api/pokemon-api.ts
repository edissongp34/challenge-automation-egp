import type { APIRequestContext, APIResponse } from '@playwright/test';
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export interface PokemonResponse {
  id: number;
  name: string;
  abilities: Array<{
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }>;
}

// Cliente API (POM para endpoints): concentra las rutas y opciones de las peticiones Pokémon.
export class PokemonApi {
  constructor(private readonly request: APIRequestContext) {}

  // Consulta el recurso usando su identificador numérico.
  getById(id: number): Promise<APIResponse> {
    return this.request.get(`${BASE_URL}/${id}`, { timeout: 10_000 });
  }

  // Codifica el nombre para usarlo de forma segura como parte de la URL.
  getByName(name: string): Promise<APIResponse> {
    return this.request.get(
      `${BASE_URL}/${encodeURIComponent(name)}`, { timeout: 10_000 });
  }
}

import type { APIRequestContext, APIResponse } from '@playwright/test';

export interface NewPost {
  title: string;
  body: string;
  userId: number;
}

// Encapsula el endpoint de publicaciones para mantener la llamada fuera del test.
export class PostsApi {
  constructor(private readonly request: APIRequestContext) {}

  // Envía el contenido como JSON y limita cuánto espera el cliente por la respuesta.
  create(post: NewPost): Promise<APIResponse> {
    return this.request.post('https://jsonplaceholder.typicode.com/posts', {
      data: post,
      timeout: 10_000,
    });
  }
}

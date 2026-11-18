import { test, expect } from '../fixtures/test.js';
import { PostsApi, type NewPost } from '../../src/api/posts-api.js';

// Verifica que JSONPlaceholder acepte el POST y devuelva la publicación enviada.
test('crea una publicación en JSONPlaceholder', async ({ request }) => {
  const postsApi = new PostsApi(request);
  const newPost: NewPost = {
    title: `Prueba Playwright ${Date.now()}`,
    body: 'Validación de creación de una publicación.',
    userId: 1,
  };

  await test.step('Enviar la publicación mediante POST', async () => {
    const response = await postsApi.create(newPost);
    expect(response.status()).toBe(201);

    // El servicio simula la creación y la respuesta debe incluir el contenido enviado.
    const createdPost = await response.json();
    await test.step('Validar el contenido y el ID de la respuesta', async () => {
      expect(createdPost).toMatchObject({
        title: newPost.title,
        body: newPost.body,
        userId: newPost.userId,
      });
      expect(createdPost.id).toEqual(expect.any(Number));
    });
  });
});

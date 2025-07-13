import { initFastifyServer } from '@tep-test/fastify-server';
import { app } from './app';
import { getConfig } from '@tep-test/config';

(async () => {
  const config = getConfig();

  await initFastifyServer({
    app,
    config,
    swaggerOptions: {
      openapi: {
        info: {
          title: 'TEP Test API',
          description: 'API documentation for TEP Test',
          version: '1.0.0',
        },
      },
    },
  });
})();

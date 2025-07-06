import { initFastifyServer } from '@tep-test/fastify-server';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

import { app } from './app';

(async () => {
  await initFastifyServer({
    app,
    host,
    port,
  });
})();

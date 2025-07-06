import Fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify';

type InitFastifyServerOptions = {
  app: FastifyPluginAsync;
  host: string;
  port: number;
};

export const initFastifyServer = async ({
  app,
  host,
  port,
}: InitFastifyServerOptions): Promise<FastifyInstance> => {
  const fastify = Fastify({ logger: true });

  fastify.register(app);

  fastify.listen({ port, host }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    } else {
      fastify.log.info(`Server is running at http://${host}:${port}`);
    }
  });

  return fastify;
};

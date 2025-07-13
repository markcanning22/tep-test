import Fastify, { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { fastifySwagger, SwaggerOptions } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import { Config } from '@tep-test/config';
import { fastifyHelmet } from '@fastify/helmet';
import { fastifySensible } from '@fastify/sensible';

type InitFastifyServerOptions = {
  app: FastifyPluginAsync;
  config: Config;
  swaggerOptions: SwaggerOptions;
};

export const initFastifyServer = async ({
  app,
  config,
  swaggerOptions,
}: InitFastifyServerOptions): Promise<FastifyInstance> => {
  const fastify = Fastify({ logger: true });

  fastify.register(fastifySensible);
  fastify.register(fastifyHelmet);

  if (config.environment === 'local' || config.environment === 'development') {
    fastify.log.info('Swagger enabled');

    fastify.register(fastifySwagger, swaggerOptions);
    fastify.register(fastifySwaggerUi, {
      routePrefix: '/docs',
    });
  }

  fastify.register(app);

  fastify.listen({ port: config.port, host: config.host }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    } else {
      fastify.log.info(
        `Server is running at http://${config.host}:${config.port}`
      );
    }
  });

  return fastify;
};

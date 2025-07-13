import { initFastifyServer } from '@tep-test/fastify-server';
import { app } from './app';
import { getConfig } from '@tep-test/config';
import { awsLambdaFastify } from '@fastify/aws-lambda';

export const handler = async (event: unknown, context: never) => {
  const config = getConfig();

  const proxy = awsLambdaFastify(
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
    })
  );

  return proxy(event, context);
};

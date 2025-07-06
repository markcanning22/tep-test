import { FastifyInstance } from 'fastify';

export const app = async (fastify: FastifyInstance) => {
  fastify.get('/', (request, reply) => {
    reply.send({ message: 'Hello API 1234' });
  });
};

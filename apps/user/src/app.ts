import { FastifyInstance } from 'fastify';
import { createUserHandler } from './handlers/create-user-handler';
import { getUsersHandler } from './handlers/get-users-handler';
import { getUserHandler } from './handlers/get-user-handler';

export const app = async (fastify: FastifyInstance) => {
  fastify.post('/users', createUserHandler);
  fastify.get('/users', getUsersHandler);
  fastify.get('/users/:id', getUserHandler);
};

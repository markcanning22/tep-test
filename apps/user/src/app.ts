import { FastifyInstance } from 'fastify';
import {
  createUserHandler,
  createUserHandlerOptions,
} from './handlers/create-user-handler';
import {
  getUsersHandler,
  getUsersHandlerOptions,
} from './handlers/get-users-handler';
import {
  getUserHandler,
  getUserHandlerOptions,
} from './handlers/get-user-handler';
import {
  deleteUserHandler,
  deleteUserHandlerOptions,
} from './handlers/delete-user-handler';

export const app = async (fastify: FastifyInstance) => {
  fastify.post('/users', createUserHandlerOptions(), createUserHandler);
  fastify.get('/users', getUsersHandlerOptions(), getUsersHandler);
  fastify.get('/users/:id', getUserHandlerOptions(), getUserHandler);
  fastify.delete('/users/:id', deleteUserHandlerOptions(), deleteUserHandler);
};

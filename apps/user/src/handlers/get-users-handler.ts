import { FastifyReply, FastifyRequest } from 'fastify';
import { getUsers } from '../repositories/user-repository';

export const getUsersHandlerOptions = () => ({
  schema: {
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            createdAt: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string' },
            type: { type: 'string' },
          },
        },
      },
    },
  },
});

export const getUsersHandler = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  const users = getUsers();

  reply.send(users);
};

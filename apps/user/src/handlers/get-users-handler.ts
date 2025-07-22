import { FastifyReply, FastifyRequest } from 'fastify';
import { getUsers } from '../repositories/user-repository';
import { Filters } from '../types';

export const getUsersHandlerOptions = () => ({
  schema: {
    summary: 'Retrieves all users',
    tags: ['Users'],
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

type GetUsersRequest = FastifyRequest<{
  Querystring: {
    filters: Filters;
  };
}>;

export const getUsersHandler = async (
  request: GetUsersRequest,
  reply: FastifyReply
) => {
  const users = getUsers(request.query.filters);

  reply.send(users);
};

import { FastifyReply, FastifyRequest } from 'fastify';
import { getUserById } from '../repositories/user-repository';

export const getUserHandlerOptions = () => ({
  schema: {
    response: {
      200: {
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
});

type GetUserRequest = FastifyRequest<{
  Params: {
    id: string;
  };
}>;

export const getUserHandler = async (
  request: GetUserRequest,
  reply: FastifyReply
) => {
  const user = getUserById(request.params.id);

  if (!user) {
    return reply.status(404).send({
      error: 'User not found',
    });
  }

  reply.send(user);
};

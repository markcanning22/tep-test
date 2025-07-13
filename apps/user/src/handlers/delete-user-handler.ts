import { FastifyReply, FastifyRequest } from 'fastify';
import { deleteUserById } from '../repositories/user-repository';
import { UserNotFoundException } from '../exceptions/user-not-found-exception';

export const deleteUserHandlerOptions = () => ({
  schema: {
    summary: 'Deletes an existing user',
    tags: ['Users'],
    response: {
      200: {},
    },
  },
});

type DeleteUserRequest = FastifyRequest<{
  Params: {
    id: string;
  };
}>;

export const deleteUserHandler = async (
  request: DeleteUserRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    deleteUserById(request.params.id);
  } catch (error) {
    if (error instanceof UserNotFoundException) {
      return reply.status(404).send({
        error: error.message,
      });
    }
  }

  reply.code(200);
};

import { FastifyReply, FastifyRequest } from 'fastify';
import { getUserById } from '../repositories/user-repository';

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

  reply.send(user);
};

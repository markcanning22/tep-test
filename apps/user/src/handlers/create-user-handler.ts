import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser } from '../repositories/user-repository';
import { NewUser } from '../types';

export type CreateUserRequest = FastifyRequest<{
  Body: NewUser;
}>;

export const createUserHandler = async (
  request: CreateUserRequest,
  reply: FastifyReply
) => {
  const createdUser = await createUser(request.body);

  reply.send(createdUser);
};

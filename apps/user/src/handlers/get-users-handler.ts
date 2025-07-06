import { FastifyReply, FastifyRequest } from 'fastify';
import { getUsers } from '../repositories/user-repository';

export const getUsersHandler = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  const users = getUsers();

  reply.send(users);
};

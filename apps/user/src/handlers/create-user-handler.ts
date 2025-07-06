import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser } from '../repositories/user-repository';

export const createUserHandler = async (
  _: FastifyRequest,
  reply: FastifyReply
) => {
  await createUser({
    firstName: 'Mark',
    lastName: 'Canning',
    password: 'changeme123',
    email: 'mark@supplyant.com',
    type: 'teacher',
  });

  reply.send({ message: 'Hello API' });
};

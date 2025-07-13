import { FastifyReply, FastifyRequest } from 'fastify';
import { createUser } from '../repositories/user-repository';
import { NewUser } from '../types';
import { ValidationError } from '../exceptions/validation-error-exception';

export const createUserHandlerOptions = () => ({
  schema: {
    summary: 'Creates a new user',
    tags: ['Users'],
    body: {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password', 'type'],
      properties: {
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        email: { type: 'string', format: 'email' },
        password: {
          type: 'string',
          minLength: 8,
          maxLength: 64,
          pattern: '^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$',
        },
        type: {
          type: 'string',
          enum: ['student', 'teacher', 'parent', 'private tutor'],
        },
      },
    },
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

export type CreateUserRequest = FastifyRequest<{
  Body: NewUser;
}>;

export const createUserHandler = async (
  request: CreateUserRequest,
  reply: FastifyReply
) => {
  try {
    const createdUser = await createUser(request.body);

    reply.send(createdUser);
  } catch (error) {
    if (error instanceof ValidationError) {
      return reply.status(400).send({
        error: error.message,
      });
    }
  }
};

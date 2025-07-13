import { FastifyReply, FastifyRequest } from 'fastify';
import { updateUser } from '../repositories/user-repository';
import { UpdatedUser } from '../types';
import { ValidationError } from '../exceptions/validation-error-exception';

export const updateUserHandlerOptions = () => ({
  schema: {
    summary: 'Updates an existing user',
    tags: ['Users'],
    body: {
      type: 'object',
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

export type UpdateUserRequest = FastifyRequest<{
  Params: { id: string };
  Body: UpdatedUser;
}>;

export const updateUserHandler = async (
  request: UpdateUserRequest,
  reply: FastifyReply
) => {
  try {
    const updatedUser = await updateUser(request.params.id, request.body);

    reply.send(updatedUser);
  } catch (error) {
    if (error instanceof ValidationError) {
      return reply.status(400).send({
        error: error.message,
      });
    }
  }
};

import Fastify, { FastifyInstance } from 'fastify';

const app = async (fastify: FastifyInstance) => {
  fastify.get('/', (request, reply) => {
    reply.send({ message: 'Hello API' });
  });
};

describe('GET /', () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = Fastify();
    server.register(app);
  });

  it('should respond with a message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.json()).toEqual({ message: 'Hello API' });
  });
});

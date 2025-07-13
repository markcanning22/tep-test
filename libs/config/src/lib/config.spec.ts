import { getConfig } from './config';

describe('config', () => {
  it('should resolve env', () => {
    process.env.HOST = 'localhost';
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'local';

    expect(getConfig()).toEqual({
      host: 'localhost',
      port: 3000,
      environment: 'local',
    });
  });
});

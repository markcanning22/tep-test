import { createUser, getUserById, getUsers } from './user-repository';
import { NewUser } from '../types';

describe('User repository', () => {
  it('should persist a new user', async () => {
    const newUser: NewUser = {
      firstName: 'Mark',
      lastName: 'Canning',
      password: 'changeme123',
      email: 'mark@supplyant.com',
      type: 'teacher',
    };

    const createdUser = await createUser(newUser);

    expect(createdUser).toEqual({
      ...newUser,
      id: createdUser.id,
      createdAt: createdUser.createdAt,
      password: createdUser.password,
    });
  });

  it('should retrieve correct user', async () => {
    const newUser: NewUser = {
      firstName: 'Mark',
      lastName: 'Canning',
      password: 'changeme123',
      email: 'mark@supplyant.com',
      type: 'teacher',
    };

    const createdUser = await createUser(newUser);

    const user = getUserById(createdUser.id);

    expect(user).toEqual({
      ...newUser,
      id: createdUser.id,
      createdAt: createdUser.createdAt,
      password: createdUser.password,
    });
  });

  it('should retrieve users', async () => {
    const users = getUsers();

    expect(users.length).toEqual(2);
  });
});

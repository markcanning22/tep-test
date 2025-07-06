import { randomUUID } from 'node:crypto';
import { hashPassword } from '../helpers/hash-password';
import { NewUser, User } from '../types';

const users: User[] = [];

export const createUser = async (user: NewUser): Promise<User> => {
  const newUser: User = {
    id: randomUUID(),
    createdAt: new Date(),
    ...user,
    password: await hashPassword(user.password),
  };

  users.push(newUser);

  return newUser;
};

export const getUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

import { randomUUID } from 'node:crypto';
import { hashPassword } from '../helpers/hash-password';
import { NewUser, UpdatedUser, User } from '../types';
import { ValidationError } from '../exceptions/validation-error-exception';
import { UserNotFoundException } from '../exceptions/user-not-found-exception';

const users: User[] = [];

export const createUser = async (user: NewUser): Promise<User> => {
  if (getUserByEmail(user.email)) {
    throw new ValidationError(`User with email ${user.email} already exists`);
  }

  const newUser: User = {
    id: randomUUID(),
    createdAt: new Date(),
    ...user,
    password: await hashPassword(user.password),
  };

  users.push(newUser);

  return newUser;
};

export const updateUser = async (
  id: string,
  user: UpdatedUser
): Promise<User> => {
  const existingUser = getUserById(id);

  if (!existingUser) {
    throw new UserNotFoundException(`User with ID ${id} does not exist`);
  }

  if (user.email && getUserByEmail(user.email)) {
    throw new ValidationError(`User with email ${user.email} already exists`);
  }

  const updatedUser: User = {
    ...existingUser,
    ...user,
    password: user.password
      ? await hashPassword(user.password)
      : existingUser.password,
  };

  const index = users.findIndex((u) => u.id === id);
  users[index] = updatedUser;

  return updatedUser;
};

export const getUsers = (): User[] => {
  return users;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return users.find((user) => user.email === email);
};

export const deleteUserById = (id: string): void => {
  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    throw new UserNotFoundException(`User with ID ${id} does not exist`);
  }

  users.splice(index, 1);
};

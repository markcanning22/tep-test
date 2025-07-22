import axios from 'axios';
import { ErrorMessage, NewUser, User } from '@tep-test/user/src/types';

const testUser: NewUser = {
  firstName: 'Mark',
  lastName: 'Canning',
  email: 'someone@somewhere.tld',
  password: 'changeMe123',
  type: 'teacher',
};

const withoutPassword = (testUser: NewUser) => {
  return {
    firstName: testUser.firstName,
    lastName: testUser.lastName,
    email: testUser.email,
    type: testUser.type,
  };
};

const testUserIds: string[] = [];

afterEach(() => {
  testUserIds.forEach(async (userId) => {
    try {
      await axios.delete(`/users/${userId}`).catch((error) => void 0);
      testUserIds.splice(testUserIds.indexOf(userId), 1);
    } catch (error) {
      console.warn(`Failed to delete test user with ID ${userId}:`, error);
    }
  });
});

describe('Users', () => {
  it('should return all users', async () => {
    const user = await axios.post<User>('/users', testUser);
    testUserIds.push(user.data.id);

    const users = await axios.get<User[]>(`/users`);

    expect(users.status).toBe(200);
    expect(users.data).toEqual(<User[]>[
      {
        ...withoutPassword(testUser),
        id: users.data[0].id,
        createdAt: users.data[0].createdAt,
      },
    ]);
  });

  it('should return correct user', async () => {
    const createdUser = await axios.post<User>('/users', testUser);
    testUserIds.push(createdUser.data.id);

    const users = await axios.get('/users');

    const userId = users.data[0].id;

    const user = await axios.get<User>(`/users/${userId}`);

    expect(user.status).toBe(200);
    expect(user.data).toEqual(<User>{
      ...withoutPassword(testUser),
      id: user.data.id,
      createdAt: user.data.createdAt,
    });
  });

  it('should not allow a user with the same email', async () => {
    const user = await axios.post<User>('/users', testUser);
    testUserIds.push(user.data.id);

    await expect(
      axios.post<ErrorMessage>('/users', testUser)
    ).rejects.toMatchObject({
      response: {
        status: 400,
        data: {
          error: `User with email ${testUser.email} already exists`,
        },
      },
    });
  });

  it('should return user without exposing password', async () => {
    const createdUser = await axios.post<User>('/users', testUser);
    testUserIds.push(createdUser.data.id);

    const user = await axios.get<User>(`/users/${createdUser.data.id}`);

    expect(user.status).toBe(200);
    expect(user.data.password).toBeUndefined();
  });

  it('should apply correct password policy', async () => {
    // Is the password too short?
    await expect(
      axios.post('/users', {
        ...testUser,
        password: 'short',
      })
    ).rejects.toMatchObject({
      response: {
        status: 400,
        data: {
          message: 'body/password must NOT have fewer than 8 characters',
        },
      },
    });

    // Is the password too long?
    await expect(
      axios.post('/users', {
        ...testUser,
        password:
          'thisIsAnIncrediblyIncrediblyIncrediblyIncrediblyIncrediblyPassword',
      })
    ).rejects.toMatchObject({
      response: {
        status: 400,
        data: {
          message: 'body/password must NOT have more than 64 characters',
        },
      },
    });

    // Is the password missing an uppercase letter or a number?
    await expect(
      axios.post<User>('/users', {
        ...testUser,
        password: 'verylong',
      })
    ).rejects.toMatchObject({
      response: {
        status: 400,
        data: {
          message:
            'body/password must match pattern "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$"',
        },
      },
    });

    // Is the password missing a number?
    await expect(
      axios.post<User>('/users', {
        ...testUser,
        password: 'veryLong',
      })
    ).rejects.toMatchObject({
      response: {
        status: 400,
        data: {
          message:
            'body/password must match pattern "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).*$"',
        },
      },
    });

    // Is the password valid?
    const response = await axios.post<User>('/users', {
      ...testUser,
      password: 'veryLong123',
    });
    expect(response.status).toBe(200);
    testUserIds.push(response.data.id);
  });

  it('should update user', async () => {
    const createdUser = await axios.post<User>('/users', testUser);
    testUserIds.push(createdUser.data.id);

    const updatedUser = await axios.patch<User>(
      `/users/${createdUser.data.id}`,
      {
        type: 'student',
      }
    );

    expect(updatedUser.status).toBe(200);
    expect(updatedUser.data).toStrictEqual({
      ...createdUser.data,
      type: 'student',
    });
  });

  it('should not be able to delete user if they were created 2 weeks ago', async () => {
    const createdUser = await axios.post<User>('/users', {
      ...testUser,
      email: 'fakeCreatedAt@supplyant.com',
    });
    testUserIds.push(createdUser.data.id);

    await expect(
      axios.delete(`/users/${createdUser.data.id}`)
    ).rejects.toMatchObject({
      response: {
        status: 400,
        data: {
          error:
            'User is too recent to be deleted. Users can only be deleted after 2 weeks of creation.',
        },
      },
    });
  });

  it('should be able to delete user if they were created less than 2 weeks ago', async () => {
    const createdUser = await axios.post<User>('/users', testUser);
    testUserIds.push(createdUser.data.id);

    const response = await axios.delete(`/users/${createdUser.data.id}`);

    expect(response.status).toBe(200);
  });

  it('should return matching users when filtering by first name', async () => {
    const createdUser1 = await axios.post<User>('/users', testUser);
    const createdUser2 = await axios.post<User>('/users', {
      ...testUser,
      firstName: 'James',
      email: 'james@supplyant.com',
    });
    testUserIds.push(createdUser1.data.id, createdUser2.data.id);

    const response = await axios.get<User[]>(`/users?filters[firstName]=Mark`);

    expect(response.data).toContainEqual(createdUser1.data);
    expect(response.data).not.toContainEqual(createdUser2.data);
  });
});

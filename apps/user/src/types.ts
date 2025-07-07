export type User = {
  id: string;
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  createdAt: Date;
  type: 'student' | 'teacher' | 'parent' | 'private tutor';
};

export type NewUser = Omit<User, 'id' | 'createdAt'>;

export type ErrorMessage = {
  error: string;
};

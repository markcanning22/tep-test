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
export type UpdatedUser = Partial<Omit<User, 'id' | 'createdAt'>>;

export type ErrorMessage = {
  error: string;
};

export type FilterableFields = 'firstName' | 'lastName' | 'email' | 'type';

export type Filters = Record<FilterableFields, string>;

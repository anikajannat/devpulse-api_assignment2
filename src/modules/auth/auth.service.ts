import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { query } from '../../config/db';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { isValidEmail, validateRole } from '../../utils/validators';
import { removePassword } from '../../utils/userUtils';
import { SafeUser, User, UserRole } from '../../types';

interface SignupInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  token: string;
  user: SafeUser;
}

export const signupUser = async (payload: SignupInput): Promise<SafeUser> => {
  const { name, email, password } = payload;
  const role = payload.role ? validateRole(payload.role) : 'contributor';

  if (!name || !email || !password) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Name, email and password are required');
  }

  if (!isValidEmail(email)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email must be valid');
  }

  const existingUser = await query<User>('SELECT * FROM users WHERE email = $1', [email]);
  if (existingUser.rows.length > 0) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds);

  const result = await query<User>(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, password, role, created_at, updated_at`,
    [name, email, hashedPassword, role],
  );

  return removePassword(result.rows[0]);
};

export const loginUser = async (payload: LoginInput): Promise<LoginResult> => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Email and password are required');
  }

  const result = await query<User>('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const tokenPayload = { id: user.id, name: user.name, role: user.role };
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'] };
  const token = jwt.sign(tokenPayload, env.jwtSecret, options);

  return { token, user: removePassword(user) };
};

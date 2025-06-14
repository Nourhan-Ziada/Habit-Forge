import bcrypt from 'bcrypt';
import users from '../models/user.model.js';
import db from '../database/db.js';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';

export const registerUserService = async (email, password) => {
  const existingUser = await db.query.users.findFirst({ where: (users) => eq(users.email, email)});
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
 await db.insert(users).values({
    email,
    passwordHash: hashedPassword,
  });
};


export const loginUserService = async (email, password) => {

  const user = await db.query.users.findFirst({ where: (users) => eq(users.email, email)});
  if (!user) {
    throw new Error('User not found');
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    token: generateToken(user.id, email),
  };
};

const generateToken = (userId, email) => {
   const secretKey = process.env.JWT_SECRET
  console.log('Generating token for user:', userId, email);
  return jwt.sign({ userId, email }, secretKey, { expiresIn: '1h' });
};

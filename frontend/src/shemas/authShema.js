import zod from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const authShema = zod.object({
  email: zod.string().email('Invalid email address').min(1, 'Email is required').regex(
    emailRegex,
    'Email must be a valid format'
  ),
  password: zod.string().regex(
    passwordRegex,
    'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number'
  ),
});

export default authShema;

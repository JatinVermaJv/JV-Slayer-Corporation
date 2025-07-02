import { PrismaClient } from '../../src/generated/prisma';
import bcrypt from 'bcrypt';
import { User } from '../types/user';

const prisma = new PrismaClient();
const saltRounds = 10;

export const createUser = async (user: User): Promise<User> => {
    const { name, email, password } = user;

    if (!password) {
        throw new Error('Password is required');
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        const isValid = await bcrypt.compare(password, existingUser.password);
        if (!isValid) throw new Error('Invalid password');
        return existingUser;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return newUser;
};
// src/services/userService.ts

import { UserAccount } from '../entities/userAccount';
import * as userRepository from '../repositories/userRepository';

export const createUser = async (user: UserAccount): Promise<UserAccount> => {
    
    const existingUser = await userRepository.findUserByEmail(user.emailId);

    if (existingUser) {
        throw new Error('User with this email already exists.');
    }

    return userRepository.createUser(user);
};

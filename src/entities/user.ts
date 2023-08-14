// src/entities/user.ts

export interface User {
    user_id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: Date;
    // Add other necessary fields here
}

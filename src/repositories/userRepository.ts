import { getCollection } from './mongodbUtils';
import { UserAccount } from '../entities/userAccount';
import { Collection } from 'mongodb';

const userAccountsCollectionName = 'userAccounts';

// Singleton instance of the userAccountsCollection
let userAccountsCollection: Collection<UserAccount> | null = null;

// Function to get the userAccountsCollection instance
const getUserAccountsCollection = async (): Promise<Collection<UserAccount>> => {
    if (!userAccountsCollection) {
        console.error("user account collection initialized")
        userAccountsCollection = await getCollection(userAccountsCollectionName);
    }
    return userAccountsCollection;
};

// Function to create a new user in the database
export const createUser = async (userData: UserAccount): Promise<any> => {
    const collection: Collection<UserAccount> = await getUserAccountsCollection();

    const userId = userData.id;

    // Check if a user with the given email already exists
    const existingUser = await collection.findOne<UserAccount>({ emailId: userData.emailId });

    if (existingUser) {
        return {
            id: existingUser.id,
            status: "existing user"
        };
    }

    const result = await collection.insertOne(userData);

    // Refresh the userAccountsCollection after successful createUser
    if (result.acknowledged)
        userAccountsCollection = null;

    return result.acknowledged ? {
        id: userId,
        status: "new user"
    } : {
        id: undefined,
        status: "user error"
    };
};

// Function to find a user by email
export const findUserByEmail = async (emailId: string): Promise<UserAccount | null> => {
    const collection: Collection<UserAccount> = await getUserAccountsCollection();
    const exist: UserAccount | null = await collection.findOne<UserAccount>(
        { emailId: emailId },
        { projection: { id: 0 } }
    );

    return exist;
};

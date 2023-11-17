import { Collection } from 'mongodb';
import { TiktokProfile } from '../../Entities/TiktokProfile';
import { getCollection } from './ConnectionPoolManager';

const collectionName = 'tiktokProfiles';

export const createTiktokProfile = async (userData: TiktokProfile): Promise<any> => {
    const tiktokProfileCollection = await getCollection(collectionName);
    const result = await tiktokProfileCollection.insertOne(userData);
    return result.insertedId;
};

import { getCollection } from './ConnectionPoolManager';
import { InstagramProfile } from '../../Entities/InstagramProfile';


const collectionName = 'instagramProfiles';

export const createInstagramProfile = async (userData: InstagramProfile): Promise<any> => {
    const instagramProfileCollection = await getCollection(collectionName);
    const result = await instagramProfileCollection.insertOne(userData);
    return result.insertedId;
};
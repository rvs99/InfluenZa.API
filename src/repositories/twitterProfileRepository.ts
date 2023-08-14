import { getCollection } from './mongodbUtils';
import { TwitterProfile } from '../entities/twitterProfile';

const collectionName = 'twitterProfiles';

export const createTwitterProfile = async (userData: TwitterProfile): Promise<any> => {
    const twitterProfileCollection = await await getCollection(collectionName);
    const result = await twitterProfileCollection.insertOne(userData);
    return result.insertedId;
};
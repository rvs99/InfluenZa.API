import { LinkedInProfile } from '../../Entities/LinkedInProfile';
import { getCollection } from './ConnectionPoolManager';

const collectionName = 'linkedinProfiles'; // Replace with the name of the collection for LinkedIn profiles

export const createLinkedInProfile = async (userData: LinkedInProfile): Promise<any> => {
    const linkedInProfileCollection = await getCollection(collectionName);
    const result = await linkedInProfileCollection.insertOne(userData);
    return result.insertedId;
};

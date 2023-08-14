import { LinkedInProfile } from '../entities/linkedInProfile';
import { getCollection } from './mongodbUtils';

const collectionName = 'linkedinProfiles'; // Replace with the name of the collection for LinkedIn profiles

export const createLinkedInProfile = async (userData: LinkedInProfile): Promise<any> => {
    const linkedInProfileCollection = await getCollection(collectionName);
    const result = await linkedInProfileCollection.insertOne(userData);
    return result.insertedId;
};

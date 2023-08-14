import { MongoClient, Db, Collection } from 'mongodb';
import { FacebookProfile } from "../entities/facebookProfile";

const mongoURI = 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false';
const dbName = 'myDatabase'; // Replace with your database name
const collectionName = 'facebookProfiles'; // Replace with the name of the collection for users

// Function to connect to the MongoDB database
const connectToMongoDB = async (): Promise<Db> => {
    const client = await MongoClient.connect(mongoURI);
    return client.db(dbName);
};


// Function to get the users collection from the database
const getFacebookProfileCollection = async (): Promise<Collection<FacebookProfile>> => {
    const db = await connectToMongoDB();
    return db.collection<FacebookProfile>(collectionName);
};

export const createFacebookProfile = async (userData: FacebookProfile): Promise<any> => {
    const facebookProfileCollection = await getFacebookProfileCollection();
    const result = await facebookProfileCollection.insertOne(userData);
    return result.insertedId;
};
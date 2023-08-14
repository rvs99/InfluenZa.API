import { MongoClient, Db, Collection, ServerApiVersion } from 'mongodb';

const mongoURI = 'mongodb://0.0.0.0:27017/InfluenZa';
const dbName = 'InfluenZa';

// Function to connect to the MongoDB database
export const connectToMongoDB = async (): Promise<Db> => {
    const client = new MongoClient(mongoURI, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    try {
        // Connect the client to the server (optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.error("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("error: " + err.message);
        throw err;
    }

    const database = client.db(dbName);
    if (database) { 
        console.error("Connected to Mongo DB");
    }
    
    return database;
};

// Generic function to get a collection
export const getCollection = async <T>(collectionName: string): Promise<Collection<T>> => {
    const db = await connectToMongoDB();
    return db.collection<T>(collectionName);
};

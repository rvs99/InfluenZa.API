import { autoInjectable } from 'tsyringe';
import ConnectionPoolManager from './ConnectionPoolManager';
import { Collection } from 'mongodb';

@autoInjectable()
export class DataRepository {
    private connectionManager: typeof ConnectionPoolManager; // Use typeof
    private readonly dbName = 'InfluenZa';

    constructor() {
        this.connectionManager = ConnectionPoolManager; // Assign the singleton instance
    }

    async getDataCollection<T>(collectionName: string): Promise<Collection<T>> {

        const connection = await this.connectionManager.acquireConnection();
        const db = connection.client.db(this.dbName);
        const collection = db.collection<T>(collectionName);

        // Release the connection back to the pool
        await this.connectionManager.releaseConnection(connection);

        return collection;
    }
}
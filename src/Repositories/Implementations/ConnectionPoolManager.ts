import { MongoClient, ServerApiVersion } from 'mongodb';
import { createPool } from 'generic-pool';

class ConnectionPoolManager {
    private static instance: ConnectionPoolManager | null = null;

    private readonly mongoURI = 'mongodb://0.0.0.0:27017';
    private readonly dbName = 'InfluenZa';
    private readonly connectionPool: any; // Replace with appropriate type

    private constructor() {
        this.connectionPool = createPool<ConnectionWrapper>({
            create: () => this.createConnection(),
            destroy: (connection: ConnectionWrapper) => this.destroyConnection(connection)
        },
            {
                max: 10, // Maximum number of connections in the pool
                min: 2,  // Minimum number of connections in the pool
            });
    }

    public static getInstance(): ConnectionPoolManager {
        if (!ConnectionPoolManager.instance) {
            ConnectionPoolManager.instance = new ConnectionPoolManager();
        }
        return ConnectionPoolManager.instance;
    }

    public async acquireConnection(): Promise<ConnectionWrapper> {
        return this.connectionPool.acquire();
    }

    public async releaseConnection(connection: ConnectionWrapper): Promise<void> {
        this.connectionPool.release(connection);
    }

    private async createConnection(): Promise<ConnectionWrapper> {
        const client = new MongoClient(this.mongoURI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        return { client };
    }

    private async destroyConnection(connection: ConnectionWrapper): Promise<void> {
        await connection.client.close();
    }
}

interface ConnectionWrapper {
    client: MongoClient;
}

export default ConnectionPoolManager.getInstance();

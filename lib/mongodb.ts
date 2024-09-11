import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to keep the MongoClient instance.
  if ((global as any)._mongoClientPromise) {
    clientPromise = (global as any)._mongoClientPromise;
  } else {
    client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    (global as any)._mongoClientPromise = client.connect();
    clientPromise = (global as any)._mongoClientPromise;
  }
} else {
  // In production mode, use a direct connection.
  client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  clientPromise = client.connect();
}

export default clientPromise;

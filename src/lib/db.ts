import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/fallback";

if (!process.env.MONGODB_URI) {
  console.warn('Invalid/Missing environment variable: "MONGODB_URI". Using fallback.');
}

const options = {
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
  maxPoolSize: 10,
};

let client: MongoClient;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | null | undefined;
}

if (!global._mongoClient) {
  global._mongoClient = new MongoClient(uri, options);
}

client = global._mongoClient;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectClient(attempt = 1, maxAttempts = 5): Promise<MongoClient> {
  if (global._mongoClientPromise) {
    return global._mongoClientPromise;
  }

  try {
    global._mongoClientPromise = client.connect().then(() => client);
    return await global._mongoClientPromise;
  } catch (error) {
    global._mongoClientPromise = null;
    if (attempt >= maxAttempts) {
      throw error;
    }
    const delay = 3000;
    console.warn(`MongoClient connect attempt ${attempt} failed. Retrying in ${delay / 1000}s...`);
    await sleep(delay);
    return connectClient(attempt + 1, maxAttempts);
  }
}

export default client;
export { connectClient };

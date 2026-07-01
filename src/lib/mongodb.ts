import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fallback";

if (!process.env.MONGODB_URI) {
  console.warn("Please define the MONGODB_URI environment variable in .env.local. Using fallback.");
}

interface MongooseCache {
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const connectionOptions = {
  bufferCommands: false,
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
};

let connectionListenersRegistered = false;

function registerConnectionListeners() {
  if (connectionListenersRegistered) return;

  mongoose.connection.on("connected", () => {
    console.info("MongoDB connected");
  });

  mongoose.connection.on("reconnected", () => {
    console.info("MongoDB reconnected");
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Connection will retry on next request.");
    cached.promise = null;
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
    cached.promise = null;
  });

  connectionListenersRegistered = true;
}

registerConnectionListeners();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptConnect(attempt: number, maxAttempts: number): Promise<typeof mongoose> {
  try {
    cached.promise = mongoose.connect(MONGODB_URI, connectionOptions).then(() => mongoose);
    return await cached.promise;
  } catch (error) {
    cached.promise = null;
    if (attempt >= maxAttempts) {
      throw error;
    }
    const delay = 3000;
    console.warn(`MongoDB connect attempt ${attempt} failed. Retrying in ${delay / 1000}s...`);
    await sleep(delay);
    return attemptConnect(attempt + 1, maxAttempts);
  }
}

async function dbConnect(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cached.promise) {
    return cached.promise;
  }

  return attemptConnect(1, 5);
}

export default dbConnect;

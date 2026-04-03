const mongoose = require('mongoose');

const MONGODB_URI = "mongodb://muneebtech005_db_user:muneebtech005_db_user@ac-8x94aps-shard-00-00.h1wz5kl.mongodb.net:27017,ac-8x94aps-shard-00-01.h1wz5kl.mongodb.net:27017,ac-8x94aps-shard-00-02.h1wz5kl.mongodb.net:27017/asmeratrealestate?ssl=true&authSource=admin&retryWrites=true&w=majority";

const PropertySchema = new mongoose.Schema({
  slug: String
}, { collection: 'properties' });

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);

async function cleanup() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');
    
    const result = await Property.deleteOne({ slug: 'family-villa-with-private-pool-1774813280900' });
    console.log('Delete result:', result);
    
    if (result.deletedCount > 0) {
      console.log('Duplicate property removed successfully.');
    } else {
      console.log('No property found with that slug.');
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

cleanup();

import mongoose from 'mongoose';

export async function connectDatabase(uri: string): Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    // For now, continue without DB (in-memory mode)
    console.log('⚠️  Running in IN-MEMORY mode (data will be lost on restart)');
  }
}

export function disconnectDatabase(): Promise<void> {
  return mongoose.disconnect();
}

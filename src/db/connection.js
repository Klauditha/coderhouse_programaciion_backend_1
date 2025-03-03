import mongoose from 'mongoose';

const url =
  'mongodb+srv://claudiav007:khZlq6KZ8p3cKwH3@cluster0.5sxko.mongodb.net/';

export async function connectMongooseDB() {
  try {
    await mongoose.connect(url);
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
  }
}

export default mongoose;

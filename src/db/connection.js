import mongoose from 'mongoose';

const url =
  'mongodb+srv://claudiav007:rNeypYHRx4iwrDrK@cluster0.5sxko.mongodb.net/';

export async function connectMongooseDB() {
  try {
    await mongoose.connect(
      url
      /*
      , {
      userNewUrlParser: true,
      useUnifiedTopology: true      
    }*/
    );
    console.log('Conexión exitosa a MongoDB Atlas');
  } catch (error) {
    console.error('Error al conectar a MongoDB Atlas:', error);
  }
}

export default mongoose;

/*
claudiav007
rNeypYHRx4iwrDrK
*/

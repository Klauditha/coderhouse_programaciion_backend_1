import express from 'express';
import morgan from 'morgan';
import handlebars from 'express-handlebars';
import indexRouter from './routes/index.js';
import viewsRouter from './routes/viewRouter.js';
import __dirname from './utils.js';
import path from 'path';
import { Server } from 'socket.io';
import fs from 'fs';
import mongoose from 'mongoose';

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

app.use('/api', indexRouter);

app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect('mongodb+srv://admin:admin@cluster0.zqzqy.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0');

const io = new Server(httpServer);

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');
  let products = [];
  //Despliegue de productos - Llamada a la API para obtener los productos
  socket.emit('products', await fetchProducts());

  //Agregar producto
  socket.on('newProduct', async (product) => {
    console.log(product);
    addProduct(product);
    io.emit('products', await fetchProducts());


  });

  //Eliminar producto
  socket.on('deleteProduct', async (productId) => {
    deleteProduct(productId);
    io.emit('products', await fetchProducts());
  });

  //Despliegue de productos
  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/products');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log('Error al obtener los productos', error);
    return [];
  }
};

const deleteProduct = async (productId) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/products/${productId}`,
      {
        method: 'DELETE',
      }
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.log('Error al eliminar el producto', error);
    return [];
  }
};

const addProduct = async (product) => {
  try {
    const response = await fetch('http://localhost:8080/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    const data = await response.json();
    console.log(data);
    return data.data;

  } catch (error) {
    console.log('Error al agregar el producto', error);
    return [];
  }
};

export default app;

import { Router } from 'express';
const router = Router();
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';
const rutaCarts = path.join(__dirname, '/utils/data/carts.json');
const rutaProducts = path.join(__dirname, '/utils/data/products.json');
import Cart from '../models/cart.js';


import Product from '../models/product.js';

router.get('/:cid', (req, res) => {
  try {
    let cartsData = JSON.parse(fs.readFileSync(rutaCarts, 'utf-8'));
    const cartData = cartsData.find((c) => c.id === parseInt(req.params.cid));
    const cart = new Cart(cartData.id, []);
    res.status(200).send({
      status: 'success',
      data: cart,
      message: 'Carrito obtenido correctamente',
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al obtener el carrito. Detalles: ' + error.message,
    });
  }
});

router.post('/', (req, res) => {
  try {
    const data = req.body;
    let cartsData = JSON.parse(fs.readFileSync(rutaCarts, 'utf-8'));
    let productsData = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
    /**Array para almacenar los productos del carrito */
    let cartProducts = [];

    /**Array para almacenar los productos */

    let products = [];
    let cantidadPrductos = productsData.length;
    /**Recorrer y procesar productos */
    for (const product of data) {
      let newProduct = new Product(
        cantidadPrductos + products.length + 1,
        product.title,
        product.description,
        product.code,
        product.price,
        product.status,
        product.stock,
        product.category,
        product.thumbnail
      );
      products.push(newProduct);
      cartProducts.push({
        id: newProduct.id,
        quantity: product.quantity,
      });
    }

    //Agregar productos al archivo products.json
    productsData.push(...products);
    fs.writeFileSync(rutaProducts, JSON.stringify(productsData, null, 2));
    /**Generar id del carrito */
    const newCart = new Cart(cartsData.length + 1, cartProducts);
    /**Agregar carrito al archivo carts.json */
    cartsData.push(newCart);
    fs.writeFileSync(rutaCarts, JSON.stringify(cartsData, null, 2));
    res.status(200).send({
      status: 'success',
      data: newCart,
      message: 'Carrito creado correctamente',
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al crear el carrito. Detalles: ' + error.message,
    });
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  try {
    /* Datos del carrito y del producto requeridos */
    let idCart = req.params.cid;
    let idProduct = req.params.pid;
    let quantity = req.body.quantity;

    /* Leer los archivos */
    let cartsData = JSON.parse(fs.readFileSync(rutaCarts, 'utf-8'));
    let productsData = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));

    /* Buscar el carrito y el producto */
    let cart = cartsData.find((c) => c.id === parseInt(idCart));
    if (cart) {
      /* Buscar el producto en el carrito */
      let product = cart.products.find((p) => p.id === parseInt(idProduct));
      /* Si el producto existe en el carrito, actualizar la cantidad */
      if (product) {
        product.quantity += quantity;
      } else {
        /* Si el producto no existe, buscarlo en el archivo products.json */
        let product = productsData.find((p) => p.id === parseInt(idProduct));
        /* Agregar el producto al carrito */
        product = { id: product.id, quantity: quantity };
        cart.products.push(product);
      }
      /* Actualizar el carrito */
      cartsData.find((c) => c.id === parseInt(idCart)).products = cart.products;
      /* Guardar los cambios en el archivo carts.json */
      fs.writeFileSync(rutaCarts, JSON.stringify(cartsData, null, 2));
      res.status(200).send({
        status: 'success',
        data: cart,
        message: 'Producto agregado correctamente',
      });
    } else {
      res.status(404).send({
        status: 'error',
        data: [],
        message: 'Carrito no encontrado',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message:
        'Error al agregar el producto al carrito. Detalles: ' + error.message,
    });
  }
});

export default router;

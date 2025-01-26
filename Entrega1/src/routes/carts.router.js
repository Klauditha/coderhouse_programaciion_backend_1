const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const rutaCarts = path.join(__dirname, '../utils/data/carts.json');
const rutaProducts = path.join(__dirname, '../utils/data/products.json');
const Cart = require('../models/cart.js');
const Product = require('../models/product.js');

router.get('/:cid', (req, res) => {
  try {
    let cartsData = JSON.parse(fs.readFileSync(rutaCarts, 'utf-8'));
    let productsData = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
    console.log(cartsData);
    const cartData = cartsData.find((c) => c.id === parseInt(req.params.cid));
    const cartProductsData = cartData.products.map((p) => {
      const product = productsData.find((prod) => prod.id === p.id);
      return { ...product, quantity: p.quantity };
    });
    const cart = new Cart(cartData.id, cartProductsData);
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

module.exports = router;

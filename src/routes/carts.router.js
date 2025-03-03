import { Router } from 'express';
const router = Router();
import { cartModel } from '../db/models/cart.model.js';
import { productModel } from '../db/models/product.model.js';

//Obtener carrito por id
router.get('/:cid', async (req, res) => {
  console.log(req.params.cid);
  try {
    const cartData = await cartModel.findById(req.params.cid);
    res.status(200).send({
      status: 'success',
      data: cartData,
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

//Crear carrito
router.post('/', async (req, res) => {
  console.log('Crear carrito');
  try {
    let newCart = await cartModel.create({ products: [] });
    res.status(200).send({
      status: 'success',
      data: newCart,
      message: 'Carrito creado correctamente',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al crear el carrito. Detalles: ' + error.message,
    });
  }
});

//Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    /* Datos del carrito y del producto requeridos */
    let idCart = req.params.cid;
    let idProduct = req.params.pid;
    let quantity = req.body.quantity;
    let cart = await cartModel.findById(idCart);
    console.log('cart');
    console.log(cart.products[0]._id);
    let product = await productModel.findById(idProduct);
    console.log('product');
    console.log(product._id);
    
    
   
    if (cart && product) {
      console.log('cart existe');

      
      if (productCart) {
        console.log('producto existe en el carrito');
        console.log(productCart);
        productCart.quantity += quantity;
      } else {
        console.log('producto no existe en el carrito');
        product = { quantity: quantity };
        cart.products.push(product);
      }
      /* Actualizar el carrito */
      cart.products = cart.products;
      /* Guardar los cambios en el archivo carts.json */
      await cartModel.findByIdAndUpdate(idCart, { products: cart.products });
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

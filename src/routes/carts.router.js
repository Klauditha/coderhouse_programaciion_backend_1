import { Router } from 'express';
const router = Router();
import { cartModel } from '../db/models/cart.model.js';
import { productModel } from '../db/models/product.model.js';
import { ObjectId } from 'mongodb';

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
    let quantityReq = req.body.quantity;
    /* Busco el carrito y el producto */
    let cart = await cartModel.findById(idCart);
    let product = await productModel.findById(idProduct);
    let agregado = false;
    /* Si el carrito y el producto existen */
    if (cart && product) {
      let idProduct = product._id;
      cart.products.forEach(async (p) => {
        let idProductCart = p._id;
        /* Si el producto existe en el carrito */
        if (idProductCart.equals(idProduct)) {
          agregado = true;
          p.quantity += quantityReq;
          await cartModel.findByIdAndUpdate(idCart, {
            $set: { products: cart.products },
          });
          let cartUpdate = await cartModel.findById(idCart);
          res.status(200).send({
            status: 'success',
            data: cartUpdate,
            message: 'Producto agregado correctamente',
          });
        }
      });
      if (!agregado) {
        await cartModel.findByIdAndUpdate(idCart, {
          $push: { products: { _id: product._id, quantity: quantityReq } },
        });
        let cart = await cartModel.findById(idCart);
        res.status(200).send({
          status: 'success',
          data: cart,
          message: 'Producto agregado correctamente',
        });
      }
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

//Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    let idCart = req.params.cid;
    let idProduct = req.params.pid;
    let cart = await cartModel.findById(idCart);
    let product = await productModel.findById(idProduct);
    if (cart && product) {
      cart.products.forEach(async (p) => {
        let idProductCart = p._id;
        if (idProductCart.equals(idProduct)) {
          await cartModel.findByIdAndUpdate(idCart, {
            $pull: { products: { _id: product._id } },
          });
          let cartUpdate = await cartModel.findById(idCart);
          console.log(cartUpdate);
          res.status(200).send({
          status: 'success',
          data: cartUpdate,
            message: 'Producto eliminado correctamente',
          });
        }
      });      
    } else {
      console.log(cart);
      console.log(product);
      if (!cart) {
        res.status(404).send({
          status: 'error',
          data: [],
          message: 'Carrito no encontrado',
        });
      } else {
        res.status(404).send({
          status: 'error',
          data: [],
          message: 'Producto no encontrado',
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al eliminar el producto del carrito. Detalles: ' + error.message,
    });
  }
});

export default router;

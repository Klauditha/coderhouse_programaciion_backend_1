import { Router } from 'express';
const router = Router();
import { cartModel } from '../db/models/cart.model.js';
import { productModel } from '../db/models/product.model.js';

//Obtener carrito por id
router.get('/:cid', async (req, res) => {
  console.log(req.params.cid);
  try {
    const cartData = await cartModel.findById(req.params.cid).populate('products.product');
    console.log(cartData.products);
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
    const { cid, pid } = req.params;
    
    // Verificamos que exista el carrito y el producto
    const cart = await cartModel.findById(cid);
    const product = await productModel.findById(pid);

    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    // Buscamos si el producto ya existe en el carrito
    const existingProductIndex = cart.products.findIndex(
      (item) =>{
        console.log(item);
        console.log(item.product.toString());
        console.log(pid);
        return item.product.toString() === pid
      }
    );

    if (existingProductIndex !== -1) {
      // Si el producto existe, incrementamos la cantidad
      cart.products[existingProductIndex].quantity += 1;
    } else {
      // Si el producto no existe, lo agregamos
      cart.products.push({
        product: pid,  // Aquí solo necesitamos el ID ya que Mongoose manejará la referencia
        quantity: 1
      });
    }

    // Guardamos los cambios y populamos los productos para la respuesta
    await cart.save();
    const populatedCart = await cartModel.findById(cid).populate('products.product');

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    let idCart = req.params.cid;
    let idProduct = req.params.pid;
    console.log(idCart);
    console.log(idProduct);
    let cart = await cartModel.findById(idCart);
    let product = await productModel.findById(idProduct);
    let eliminado = false;
    if (cart && product) {
      cart.products.forEach(async (p) => {
        let idProductCart = p.product._id;
        if (idProductCart.equals(idProduct)) {
          eliminado = true;
          await cartModel.findByIdAndUpdate(idCart, {
            $pull: { products: { _id: product._id } },
          });
        }
      });
      if (!eliminado) {
        res.status(404).send({
          status: 'error',
          data: [],
          message: 'Producto no encontrado en el carrito',
        });
      } else {
        let cartUpdate = await cartModel.findById(idCart);
        res.status(200).send({
          status: 'success',
          data: cartUpdate,
          message: 'Producto eliminado correctamente',
        });
      }
    } else {
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
      message:
        'Error al eliminar el producto del carrito. Detalles: ' + error.message,
    });
  }
});

//Actualizar carrito con arreglo de productos
router.put('/:cid', async (req, res) => {
  try {
    let idCart = req.params.cid;
    let products = req.body.products;
    let cart = await cartModel.findById(idCart);
    let nuevosProductos = false;
    if (cart) {
      products.forEach(async (p) => {
        let product = await productModel.findById(p);
        console.log(cart.products[0]);
        console.log(p);
        //producto existe en la base de datos
        if (product) {
          //producto existe en el carrito
          //console.log("producto en el carrito: ",cart.products[0]._id);
          console.log("producto en la base de datos: ",product._id);
          if (!cart.products.some((productCart) => productCart._id.equals(product._id))) {
            //agregar el producto al carrito
            console.log('producto agregado al carrito');
            nuevosProductos = true;
            await cartModel.findByIdAndUpdate(idCart, {
              $push: { products: { _id: product._id, quantity: 0 } },
            });
          } 
        }
      });
      if (nuevosProductos) {
        await cartModel.findByIdAndUpdate(idCart, {
          $set: { products: cart.products },
        });
        let cartUpdate = await cartModel.findById(idCart);
        res.status(200).send({
          status: 'success',
          data: cartUpdate,
          message: 'Carrito actualizado correctamente',
        });
      } else{

        res.status(200).send({
          status: 'success',
          data: cart,
          message: 'Producto(s) ya existentes en el carrito',
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
      message: 'Error al actualizar el carrito. Detalles: ' + error.message,
    });
  }
});

//Actualizar la cantidad de un producto en específico en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    let idCart = req.params.cid;
    let idProduct = req.params.pid;
    let quantityReq = req.body.quantity;
    let cart = await cartModel.findById(idCart);
    let actualizado = false;
    if (cart) {
      cart.products.forEach(async (p) => {
        let idProductCart = p._id;
        if (idProductCart.equals(idProduct)) {
          actualizado = true;
          p.quantity += quantityReq;
          await cartModel.findByIdAndUpdate(idCart, {
            $set: { products: cart.products },
          });
        }
      });
      if (!actualizado) {
        res.status(404).send({
          status: 'error',
          data: [],
          message: 'Producto no encontrado en el carrito',
        });
      } else {
        let cartUpdate = await cartModel.findById(idCart);
        res.status(200).send({
          status: 'success',
          data: cartUpdate,
          message: 'Cantidad actualizada correctamente',
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
        'Error al actualizar la cantidad del producto. Detalles: ' +
        error.message,
    });
  }
});

//Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    let idCart = req.params.cid;
    await cartModel.findByIdAndUpdate(idCart, { $set: { products: [] } });
    res.status(200).send({
      status: 'success',
      data: [],
      message: 'Carrito vaciado correctamente',
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al vaciar el carrito. Detalles: ' + error.message,
    });
  }
});

export default router;

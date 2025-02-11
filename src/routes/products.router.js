import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import Product from '../models/product.js';
import __dirname from '../utils.js';

const router = Router();
const rutaProducts = path.join(__dirname, '/utils/data/products.json');


//GET /api/products
router.get('/', (req, res) => {
  try {
    let productsData = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
    const limit = parseInt(req.query.limit) || productsData.length;
    const limitedProducts = productsData.slice(0, limit);
    res.status(200).send({
      status: 'success',
      data: limitedProducts,
      message: 'Productos obtenidos correctamente',
    });
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al obtener los productos. Detalles: ' + error.message,
    });
  }
});

//GET /api/products/:pid
router.get('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    let productsData = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
    const product = productsData.find((p) => p.id === productId);
    if (!product) {
      res
        .status(404)
        .send({ status: 'error', data: [], message: 'Producto no encontrado' });
    } else {
      res.status(200).send({
        status: 'success',
        data: product,
        message: 'Producto obtenido correctamente',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al obtener el producto. Detalles: ' + error.message,
    });
  }
});

// POST /api/products
router.post('/', (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    if (
      !data.title ||
      !data.description ||
      !data.price ||
      !data.code ||
      !data.stock ||
      !data.category
    ) {
      res.status(400).send({
        status: 'error',
        data: [],
        message: 'Faltan datos requeridos',
      });
    } else {
      let productsData = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
      console.log(data.status);
      const status = data.status ? true : false;
      let newProduct = new Product(
        productsData.length + 1,
        data.title,
        data.description,
        data.code,
        data.price,
        data.status,
        data.stock,
        data.category,
        data.thumbnail
      );
      productsData.push(newProduct);
      fs.writeFileSync(rutaProducts, JSON.stringify(productsData, null, 2));
      res.status(200).send({
        status: 'success',
        data: newProduct,
        message: 'Producto creado correctamente',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al crear el producto. Detalles: ' + error.message,
    });
  }
});

//PUT /api/products/:pid
router.put('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    const data = req.body;
    let productsData = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
    const productIndex = productsData.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      res
        .status(404)
        .send({ status: 'error', data: [], message: 'Producto no encontrado' });
    } else {
      productsData[productIndex] = {
        ...productsData[productIndex],
        ...new Product(
          productId,
          data.title || productsData[productIndex].title,
          data.description || productsData[productIndex].description,
          data.code || productsData[productIndex].code,
          data.price || productsData[productIndex].price,
          data.stock || productsData[productIndex].stock,
          data.category || productsData[productIndex].category,
          data.thumbnail || productsData[productIndex].thumbnail
        ),
      };
      fs.writeFileSync(rutaProducts, JSON.stringify(productsData, null, 2));
      res.status(200).send({
        status: 'success',
        data: productsData[productIndex],
        message: 'Producto actualizado correctamente',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al actualizar el producto. Detalles: ' + error.message,
    });
  }
});

//DELETE /api/products/:pid
router.delete('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
    let productsData = JSON.parse(fs.readFileSync(rutaProducts, 'utf-8'));
    const productIndex = productsData.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      res
        .status(404)
        .send({ status: 'error', data: [], message: 'Producto no encontrado' });
    } else {
      productsData.splice(productIndex, 1);
      fs.writeFileSync(rutaProducts, JSON.stringify(productsData, null, 2));
      res.status(200).send({
        status: 'success',
        data: [],
        message: 'Producto eliminado correctamente',
      });
    }
  } catch (error) {
    res.status(500).send({
      status: 'error',
      data: [],
      message: 'Error al eliminar el producto. Detalles: ' + error.message,
    });
  }
});

export default router;

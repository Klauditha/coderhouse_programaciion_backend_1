const { Router } = require('express');
const router = Router();
const { uploader } = require('../utils/utils.js');
const fs = require('fs');
const path = require('path');
const { products } = require('../utils/data/products.json');

//GET /api/products
// Listar productos
router.get('/', (req, res) => {
  const limit = parseInt(req.query.limit) || products.length;
  const limitedProducts = products.slice(0, limit);
  res.send(limitedProducts);
});

//GET /api/products/:pid
// Obtener un producto por su ID
router.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const product = products.find((p) => p.id === productId);
  if (!product) {
    res.status(404).send({ error: 'Producto no encontrado' });
  } else {
    res.send(product);
  }
});

//POST /api/products
// Crear un nuevo producto
router.post('/', (req, res) => {
  try {
    const newProduct = req.body;
    if (
      !newProduct.title ||
      !newProduct.description ||
      !newProduct.price ||
      !newProduct.code ||
      !newProduct.stock
    ) {
      res.status(400).send({ error: 'Faltan datos requeridos' });
    } else {
      let productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/data/products.json'), 'utf-8'));
      const newProductId = productsData.length ? productsData[productsData.length - 1].id + 1 : 1;

      newProduct.id = newProductId;
      productsData.push(newProduct);
      console.log(productsData);
      fs.writeFileSync(
        path.join(__dirname, '../utils/data/products.json'),
        JSON.stringify(productsData, null, 2)
      );
      res.send(newProduct);
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al crear el producto. Detalles: ' + error.message });
  }
});

//PUT /api/products/:pid
// Actualizar un producto existente
router.put('/:pid', (req, res) => {
  try {
    console.log(req.body);
    const productId = parseInt(req.params.pid);
    const updatedProduct = req.body;
    let productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/data/products.json'), 'utf-8'));
    console.log(productsData);
    const productIndex = productsData.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      res.status(404).send({ error: 'Producto no encontrado' });
    } else {
      productsData[productIndex] = { ...productsData[productIndex], ...updatedProduct };
      fs.writeFileSync(
        path.join(__dirname, '../utils/data/products.json'),
        JSON.stringify(productsData, null, 2)
      );
      res.send(updatedProduct);
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar el producto. Detalles: ' + error.message });
  }
});

//DELETE /api/products/:pid
// Eliminar un producto existente
router.delete('/:pid', (req, res) => {
  try {
    const productId = parseInt(req.params.pid); 
    let productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../utils/data/products.json'), 'utf-8'));
    const productIndex = productsData.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
    res.status(404).send({ error: 'Producto no encontrado' });
  } else {
    productsData.splice(productIndex, 1);
    fs.writeFileSync(
      path.join(__dirname, '../utils/data/products.json'),
      JSON.stringify(productsData, null, 2)
    );
      res.send({ message: 'Producto eliminado correctamente' });
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar el producto. Detalles: ' + error.message });
  }
});

module.exports = router;

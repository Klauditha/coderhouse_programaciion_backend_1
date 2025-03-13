import express from 'express';
import { productModel } from '../db/models/product.model.js';
const router = express.Router();
import axios from 'axios';

router.get('/', async (req, res) => {
    try {   
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'asc';
        //const query = req.query.query || '';
        console.log(limit, page, sort);
        let result = await axios.get(`http://localhost:8080/api/products?limit=${limit}&page=${page}&sort=${sort}`);
        result.data.prevLink = result.data.hasPrevPage ? `/?limit=${limit}&page=${result.data.prevPage}&sort=${sort}` : null;
        result.data.nextLink = result.data.hasNextPage ? `/?limit=${limit}&page=${result.data.nextPage}&sort=${sort}` : null;
        console.log(result.data);
        res.render('home', { result: result.data});
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: 'error',
            data: [],
            message: 'Error al obtener los productos. Detalles: ' + error.message,
        });
    }
});

router.get('/realTimeProducts', async (req, res) => {
    let products = await productModel.find();
    res.render('realTimeProducts', { products });
});



export default router;
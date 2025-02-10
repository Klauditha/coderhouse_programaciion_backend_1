import express from 'express';
import fs from 'fs';
import path from 'path';
import __dirname from '../utils.js';

const router = express.Router();

router.get('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, '/utils/data/products.json'), 'utf-8'));
    res.render('home', { products });
});




export default router;
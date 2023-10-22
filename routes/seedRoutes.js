import express from 'express';
import Product from '../models/productModel.js';
import { data } from '../data.js';


const seedRouter = express.Router();

seedRouter.get('/reseeding', async (req, res) => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(data.products);



    res.send({ message: 'Data reseeded successfully!', createdProducts });
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while reseeding the data.' });
  }
});

export default seedRouter;

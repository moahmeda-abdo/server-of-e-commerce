import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// Handle fetching all products with pagination
const handleAllProdcuts = expressAsyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  try {
    const products = await Product.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const totalProducts = await Product.countDocuments();

    res.json({
      products,
      page,
      pages: Math.ceil(totalProducts / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Handle fetching a product by slug
const handleSlugProdcuts = expressAsyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// Handle fetching a product by ID
const handleIdProdcuts = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// Handle updating products and reducing countInStock
const handleUpdateProdcuts = expressAsyncHandler(async (req, res) => {
  try {
    const { products } = req.body;
    products.forEach(async (productData) => {
      const { productId, quantity } = productData;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      const updatedCountInStock = product.countInStock - quantity;
      product.countInStock = updatedCountInStock;
      await product.save();
    });
    res.status(200).json({ message: "Products updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Handle fetching distinct product categories
const handleCategories = expressAsyncHandler(async (req, res) => {
  const categoriess = await Product.distinct("category");
  res.send(categoriess);
});

// Handle fetching all products for admin
const handleAllProdcutsForAdmin = expressAsyncHandler(async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

// Handle deleting a product by ID for admin
const handleDeleteForAdmin = expressAsyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndRemove(req.params.id);

  if (deletedProduct) {
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).send({ message: 'Something went wrong' });
  }
});

// Handle creating a new product for admin
const handleCreateProdcutsForAdmin = expressAsyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    slug,
    brand,
    countInStock,
    image,
    category,
  } = req.body;

  const newProduct = new Product({
    name: name,
    category: category,
    slug: slug,
    price: price,
    description: description,
    countInStock: countInStock,
    image: image,
    brand: brand,
    numReviews: 3,
    rating: 5,
  });

  const product = await newProduct.save();
  res.status(201).send({ message: "Product Created", product });
});

// Handle updating a product for admin
const handleUpdateProductForAdmin = expressAsyncHandler(async (req, res) => {
  const productId = req.params.id;
  const product = await Product.findById(productId);
  if (product) {
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.image = req.body.image;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    await product.save();
    res.send({ message: "Product Updated" });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

// Handle creating product reviews
const handleReviews = expressAsyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    if (product.reviews.find((x) => x.name === req.user.name)) {
      return res.status(400).send({ message: "You already submitted a review" });
    }
    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((a, c) => c.rating + a, 0) /
      product.reviews.length;
    const updatedProduct = await product.save();
    res.status(201).send({
      message: "Review Created",
      review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
      numReviews: product.numReviews,
      rating: product.rating,
    });
  } else {
    res.status(404).send({ message: "Product Not Found" });
  }
});

// Handle searching for products with pagination
const handleSearchProdcuts = expressAsyncHandler(async (req, res) => {
  const pageSize = 10;
  const { query } = req;
  const searchQuery = query.query;
  const page = query.page || 1;

  const queryFilter = searchQuery
    ? { name: { $regex: searchQuery, $options: "i" } }
    : {};

  const products = await Product.find({
    ...queryFilter,
  })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  });

  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

// Handle searching for products by category with pagination
const handleCategoryProdcuts = expressAsyncHandler(async (req, res) => {
  const pageSize = 10;
  const { query } = req;
  const searchQuery = query.query;
  const page = query.page || 1;

  const queryFilter = searchQuery
    ? { category: { $regex: searchQuery, $options: "i" } }
    : {};

  const products = await Product.find({
    ...queryFilter,
  })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
  });

  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

export {
  handleReviews,
  handleAllProdcuts,
  handleIdProdcuts,
  handleSlugProdcuts,
  handleUpdateProdcuts,
  handleCategories,
  handleAllProdcutsForAdmin,
  handleDeleteForAdmin,
  handleCreateProdcutsForAdmin,
  handleUpdateProductForAdmin,
  handleSearchProdcuts,
  handleCategoryProdcuts,
};

const { Product, User } = require('../models');

// Get all products
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, condition, minPrice, maxPrice } = req.query;
    
    const offset = (page - 1) * limit;
    
    const whereClause = {};
    if (category) whereClause.category = category;
    if (condition) whereClause.condition = condition;
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.$gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.$lte = parseFloat(maxPrice);
    }

    const products = await Product.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'firstName', 'lastName', 'rating']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        products: products.rows,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(products.count / limit),
          totalItems: products.count,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id, {
      include: [
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'firstName', 'lastName', 'rating', 'location']
        }
      ]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.increment('views');

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, condition, images } = req.body;
    const sellerId = req.user.id;

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      category,
      condition,
      images: images || [],
      sellerId
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user's products
const getUserProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const products = await Product.findAll({
      where: { sellerId: userId },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  getUserProducts
}; 
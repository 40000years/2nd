const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

// Define relationships

// User - Product (One-to-Many)
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// User - Order (One-to-Many) as Buyer
User.hasMany(Order, { foreignKey: 'buyerId', as: 'buyerOrders' });
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

// User - Order (One-to-Many) as Seller
User.hasMany(Order, { foreignKey: 'sellerId', as: 'sellerOrders' });
Order.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });

// Product - Order (One-to-Many)
Product.hasMany(Order, { foreignKey: 'productId', as: 'orders' });
Order.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  User,
  Product,
  Order
}; 
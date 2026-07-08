const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
// في server.js
const authRoutes = require('./routes/auth.route');
const productRoutes = require('./routes/product.route');
const userRoutes = require('./routes/user.route'); 
dotenv.config();

connectDB();
// في ملف server.js
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes); 

app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
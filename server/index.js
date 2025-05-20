const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://funnydev94625:starc0911@cluster0.kpjac1a.mongodb.net/test';
mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
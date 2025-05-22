// Add this with the other route imports
const policyRoutes = require('./routes/policyRoutes');

// Add this with the other app.use statements
app.use('/api/policies', policyRoutes);
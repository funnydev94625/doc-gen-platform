module.exports = function(req, res, next) {
  // Check if user is admin
  console.log(req.user)
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. Admin role required.' });
  }
}; 
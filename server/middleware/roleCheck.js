const roleCheck = (role) => {
  return (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === role) {
      next();
    } else {
      res.status(403).json({ message: `Access denied. ${role} role required.` });
    }
  };
};

module.exports = roleCheck; 
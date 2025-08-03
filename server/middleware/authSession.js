const authSession = (req, res, next) => {
  if (req.session && req.session.user) {
    // Embed trusted school and class identifiers in the request
    req.schoolId = req.session.user.schoolId;
    req.class = req.session.user.class;
    req.userType = req.session.user.userType;
    next();
  } else {
    res.status(401).json({ message: 'Authentication required' });
  }
};

module.exports = authSession; 
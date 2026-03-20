import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token.' });
    req.user = user; 
    next();
  });
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Admin access required.' });
  }
  next();
};

export const isOrgAdmin = (req, res, next) => {
  if (req.user.role !== 'ORG_ADMIN' && req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Org admin access required.' });
  }
  next();
};



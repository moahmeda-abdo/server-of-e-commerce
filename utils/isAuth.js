import jwt from 'jsonwebtoken';

// Middleware to check if a user is authenticated
export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); 
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

// Middleware to check if a user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid admin token" });
  }
};

// Middleware to check if a user is an admin or a viewer
export const isViewer = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.isViewer)) {
    next();
  } else {
    res.status(401).send({ message: "Invalid admin token" });
  }
};

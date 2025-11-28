import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  // Token from header or cookie
  const headerToken = req.header("Authorization")?.replace("Bearer ", "");
  const cookieToken = req.cookies?.token;

  const token = headerToken || cookieToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};



export const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Unauthorized role." });
    }
    next();
  };
};



// backend/middleware/roleMiddleware.js

export const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!userRole) {
        return res.status(401).json({ message: "Unauthorized: Role missing" });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (error) {
      console.error("Role middleware error:", error);
      res.status(500).json({ message: "Internal Server Error in role check" });
    }
  };
};

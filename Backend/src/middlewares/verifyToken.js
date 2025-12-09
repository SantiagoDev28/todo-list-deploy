import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req, res, next) => {
  try {
    // Leer token desde encabezados
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "Token no proporcionado o formato inválido" 
      });
    }

    const token = authHeader.split(" ")[1];

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guardar información del usuario dentro de req.user
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();

  } catch (error) {
    console.error("JWT Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "El token ha expirado"
      });
    }

    return res.status(403).json({
      success: false,
      message: "Token inválido"
    });
  }
};

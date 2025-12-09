import express from "express";
import cors from "cors";
import "dotenv/config";
import { testConnection } from "../Database/connection.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Desarrollo local Vite
  "http://localhost:3000",  // Desarrollo local backend
  "http://localhost",       // Desarrollo local
  "http://localhost:80",    // Desarrollo local
  process.env.FRONTEND_URL  // Variable de entorno para producción
].filter(Boolean); // Filtra valores undefined

console.log("🔐 CORS Origins permitidos:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir sin origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS rechazado para origin: ${origin}`);
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400 // 24 horas
}));

app.use(express.json());

// Ruta de prueba
app.get("/api", (req, res) => {
  res.json({ message: "API funcionando" });
});


const startServer = async () => {
  console.log("⏳ Probando conexión a la base de datos...");

  const ok = await testConnection();

  if (!ok) {
    console.error("❌No se pudo iniciar el backend porque MySQL no está disponible.");
    process.exit(1);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor backend iniciado en el puerto ${PORT}`);
  });
};

startServer();


// RUTAS API
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);


export default app;
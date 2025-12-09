import express from "express";
import cors from "cors";
import "dotenv/config";
import { testConnection } from "../Database/connection.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    "http://localhost:5173", // Para desarrollo local
    "https://todo-list-deploy-production.up.railway.app/" // TU DOMINIO DE VERCEL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
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
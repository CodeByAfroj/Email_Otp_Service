import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import router from "./routes/otp_routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/otp", router);

app.get("/", (req, res) => {
  res.send("OTP Backend Running ✅");
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

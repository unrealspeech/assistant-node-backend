import express from "express";
import cors from "cors";
import router from "./src/api/assistant.js";
const app = express();

app.use(cors());

app.use(express.json());
app.use("/api", router);
// Error handling middleware should be last
app.use((err, _req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

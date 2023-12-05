import { Router } from "express";
import { createAssistant } from "../controller/assistant.js";

const router = Router();

router.post("/assistant", createAssistant);

export default router;

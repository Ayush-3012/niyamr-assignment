import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import { checkRules } from "../controllers/pdf.controller.js";

const pdfRouter = Router();

pdfRouter.route("/check-rules").post(upload.single("file"), checkRules);

export default pdfRouter;

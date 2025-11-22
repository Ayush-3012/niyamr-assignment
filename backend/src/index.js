import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import pdfRouter from "./routes/pdf.route.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

app.use("/api/v1/pdf", pdfRouter);

app.listen(process.env.PORT, () => {
  console.log(` Server is listening to port ${process.env.PORT} `);
});

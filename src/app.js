import express from "express";
import morgan from "morgan";
import handlebars from "express-handlebars";
import indexRouter from "./routes/index.js";
import viewsRouter from "./routes/viewRouter.js";
import __dirname from './utils.js';
import path from "path";
import { Server } from "socket.io";
import fs from "fs";

const PORT = 8080;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use("/api", indexRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");
app.use(express.static(path.join(__dirname, "public")));
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");
});

io.on("disconnect", (socket) => {
  console.log("Cliente desconectado");
});

export default app;

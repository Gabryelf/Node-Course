import express from "express";

import pageRouter from "./routers/pages.js";
import apiRouter from "./routers/api.js";

const app = express();
const port = 3000;

//midlleware - промежуточные слои
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

//routers - обработчики запросов
app.use("/", pageRouter);
app.use("/api", apiRouter);

// запуск
app.listen(port, () => {
    console.log(`http://localhost:${port}`);
});

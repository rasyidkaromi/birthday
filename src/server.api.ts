import express, { Application } from 'express';
import { routes } from "./routes/UserRoute";

const PORT = 3000;
const app: Application = express();
app.use(express.json());
routes(app);

app.get("/test", (req, res) => {
    res.send(`Working on port ${PORT}.`);
});

const listend = app.listen(PORT, () => {
    console.log("Api Server running on port", PORT);
});

export { PORT, app, listend };

import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import walletRouter from "./routes/wallet.route";
import { fileURLToPath } from "url";
import paymentRouter from "./routes/payment.route";

dotenv.config({
    // path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
    path: fileURLToPath(new URL(".env",new URL ("..",import.meta.url))),
});
const PORT = process.env.PORT || 3000;

const app = express();

//MIDDLEWAREa
app.use(helmet());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/wallet",walletRouter)
app.use("/payment",paymentRouter)
app.get("/health",(req,res)=>{
    res.status(200).send('Hello from TypeScript Express!');
})

app.listen(PORT,()=>{
    console.log(`app listen in http://localhost:${PORT}`)
})
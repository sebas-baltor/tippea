import { type RequestHandler } from "express"
// import type { IController } from "../types/request.types"
import walletService from "@/service/wallet.service";

const getAddress:RequestHandler = async (req, res) =>{
    try{
        const {walletId} = req.body
        const walletAddress = await walletService.getWalletAddress({walletId})
        res.json(walletAddress);
    }catch(error){
        res.send(error)
    }
}
interface IWalletController {
    getAddress:RequestHandler
}

const walletController:IWalletController = {getAddress};

export default walletController;
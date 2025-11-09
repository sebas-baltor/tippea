import Router from 'express';
import walletController from "../controller/wallet.controller"

const walletRouter = Router();

walletRouter
  .get('/address', walletController.getAddress)

export default walletRouter;

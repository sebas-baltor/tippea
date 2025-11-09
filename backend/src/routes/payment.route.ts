import Router from 'express';
import paymentController from '@/controller/payment.controller';

const paymentRouter = Router();

paymentRouter
  .post('/incoming-payment', paymentController.createIncomingPayment)
  .post('/quote',paymentController.createQuote)
  .post('/grant',paymentController.createQuoteGrant)
  .post('/outgoing-payment',paymentController.createOutgoingPayment)

export default paymentRouter;

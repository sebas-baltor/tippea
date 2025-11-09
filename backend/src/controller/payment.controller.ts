import { type RequestHandler } from "express"
import { isFinalizedGrant, OpenPaymentsClientError } from "@interledger/open-payments"
import walletService from "@/service/wallet.service"
import grantService from "@/service/grant.service"
import paymentService from "@/service/payment.service"
import quoteService from "@/service/quote.service"
import interledgerClient from "@/config/interledger-client"

// WORKS FOR CREATE INCOMINT PAYMENTS BASE ONTHE AUTH SERVER
const createIncomingPayment:RequestHandler = async (req,res)=>{
    try {
        const {walletId, amount} = req.body;
    
         // Step 1: Get the sending and receiving wallet addresses
        const wallet = await walletService.getWalletAddress({walletId});

        // Step 2: Get a grant for the incoming payment, so we can create the incoming payment on the receiving wallet address
        const paymentGrant = await grantService.createIncomingGrant({authServer:wallet.authServer});

         if (!isFinalizedGrant(paymentGrant)) {
            throw new Error('Expected finalized incoming payment grant')
        }
         // Step 3: Create the incoming payment. This will be where funds will be received.
        const incomingPayment = await paymentService.createIncomingPayment({wallet,paymentGrant,amount})
        
        res.json(incomingPayment)
    }catch(error){
        res.json(error);
    }
}
 
const createQuote:RequestHandler = async (req,res)=>{
    try{
        const {walletId,incomingPaymentId} = req.body;
        
        const wallet = await walletService.getWalletAddress({walletId});
        
        // Step 4: Get a quote grant, so we can create a quote on the sending wallet address
        const quoteGrant = await  grantService.createQuoteGrant({wallet})
        // console.log("quote-grant ",quoteGrant);

        if (!isFinalizedGrant(quoteGrant)) {
            throw new Error('Expected finalized quote grant')
        }
        // Step 5: Create a quote, this gives an indication of how much it will cost to pay into the incoming payment
        const quote = await quoteService.getQuote({wallet,grant:quoteGrant,incomingPaymentId})
        
        res.send(quote);
    }catch(error){
        console.log("an error accurs")
        res.send(error)
    }
}

const createQuoteGrant:RequestHandler = async (req,res)=>{
    try{
        const {walletId,debitAmount,intervals} = req.body;

        const wallet = await walletService.getWalletAddress({walletId});

        const outgoingPaymentGrant = await grantService.createOutgoingPaymentGrant({wallet,debitAmount,intervals})

        console.log(
            '\nStep 7: got pending outgoing payment grant',
            outgoingPaymentGrant
        )
        
        console.log(
            'Please navigate to the following URL, to accept the interaction from the sending wallet:'
        )
        //@ts-ignore
        console.log(outgoingPaymentGrant.interact.redirect)

        res.send(outgoingPaymentGrant);

    }catch(error){
        console.log("an error accurs")
        res.send(error)
    }
}

const createOutgoingPayment:RequestHandler = async (req,res)=>{
    try{
        const {walletId,redirecUri,continueToken,quoteId} = req.body;

        const wallet = await walletService.getWalletAddress({walletId});

        
        let finalizedOutgoingPaymentGrant

        const grantContinuationErrorMessage =
            '\nThere was an error continuing the grant. You probably have not accepted the grant at the url (or it has already been used up, in which case, rerun the script).'

        try {
            finalizedOutgoingPaymentGrant = await interledgerClient.grant.continue({
                url: redirecUri,
                accessToken: continueToken
            })
            console.log("this is the finalized outgoing grant", finalizedOutgoingPaymentGrant);
        } catch (err) {
            if (err instanceof OpenPaymentsClientError) {
                console.log("there is an erro here")
                console.log(grantContinuationErrorMessage)
            }

            throw err
        }

        if (!isFinalizedGrant(finalizedOutgoingPaymentGrant)) {
            console.log(
            'There was an error continuing the grant. You probably have not accepted the grant at the url.'
            )
            throw new Error();
        }

        const outgoingPayment = await paymentService.createOutgoingPayment({wallet,finalizedOutgoingPaymentGrant,quoteId});

        return outgoingPayment;

    }catch(error){
        console.log("something went wrong")
        res.send(error)
    }
}


interface IPaymentController {
    createIncomingPayment:RequestHandler,
    createQuote:RequestHandler,
    createOutgoingPayment:RequestHandler,
    createQuoteGrant:RequestHandler
}
const paymentController:IPaymentController = {createIncomingPayment,createQuote,createOutgoingPayment,createQuoteGrant};
export default paymentController;
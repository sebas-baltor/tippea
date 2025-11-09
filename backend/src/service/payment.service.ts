import interledgerClient from "@/config/interledger-client";
import { Grant, Quote, WalletAddress } from "@interledger/open-payments";
async function createIncomingPayment ({wallet, paymentGrant, amount}:{wallet:WalletAddress, paymentGrant:Grant,amount:string}){
    return await interledgerClient.incomingPayment.create(
    {
      url: wallet.resourceServer,
      accessToken: paymentGrant.access_token.value
    },
    {
      walletAddress: wallet.id,
      incomingAmount: {
        assetCode: wallet.assetCode,
        assetScale: wallet.assetScale,
        value: amount+"00"
      }
    }
  )
}

async function createOutgoingPayment({wallet,finalizedOutgoingPaymentGrant,quoteId}:{wallet:WalletAddress,finalizedOutgoingPaymentGrant:Grant, quoteId:string}){
    return await interledgerClient.outgoingPayment.create(
    {
      url: wallet.resourceServer,
      accessToken: finalizedOutgoingPaymentGrant.access_token.value
    },
    {
      walletAddress: wallet.id,
      quoteId: quoteId
    }
  )
}

const paymentService = {createIncomingPayment,createOutgoingPayment};

export default paymentService;
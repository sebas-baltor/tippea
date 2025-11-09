import interledgerClient from "@/config/interledger-client";
import { Grant, WalletAddress } from "@interledger/open-payments";
async function getQuote ({wallet,grant,incomingPaymentId}:{wallet:WalletAddress,grant:Grant,incomingPaymentId:string}){
    return await interledgerClient.quote.create(
    {
      url: wallet.resourceServer,
      accessToken: grant.access_token.value
    },
    {
      walletAddress: wallet.id,
      receiver: incomingPaymentId,
      method: 'ilp'
    }
  )
}

const quoteService = {getQuote};

export default quoteService;


import interledgerClient from "@/config/interledger-client";
import { Grant, PendingGrant, Quote, WalletAddress } from "@interledger/open-payments";
async function createIncomingGrant ({authServer}:{authServer:string}):Promise<Grant | PendingGrant>{
    const incominGrant = await interledgerClient.grant.request(
    {
      url: authServer
    },
    {
      access_token: {
        access: [
          {
            type: 'incoming-payment',
            actions: ['read', 'complete', 'create']
          }
        ]
      }
    }
  )
    return incominGrant;
}

async function createQuoteGrant({wallet}:{wallet:WalletAddress}):Promise<Grant | PendingGrant>{
    return await interledgerClient.grant.request(
    {
      url: wallet.authServer
    },
    {
      access_token: {
        access: [
          {
            type: 'quote',
            actions: ['create', 'read']
          }
        ]
      }
    }
  )
}
interface DebitAmount {
    assetCode:string,
    assetScale:number,
    value:string
}
interface GrantIntervals {
    repetitions:number;
    startDateUTC:string;
    period:string;
}

async function createOutgoingPaymentGrant ({wallet,debitAmount,intervals}:{wallet:WalletAddress,debitAmount:DebitAmount,intervals?:GrantIntervals}){
    let hasInterval = "";

    if(intervals){
        hasInterval = `R${intervals.repetitions}/${intervals.startDateUTC}/P${intervals.period}M`
    }
    
    return  await interledgerClient.grant.request(
    {
      url: wallet.authServer
    },
    {
      access_token: {
        access: [
          {
            type: 'outgoing-payment',
            actions: ['read', 'create'],
            limits: {
                ...(hasInterval && {interval:hasInterval}),
              debitAmount: {
                assetCode: debitAmount.assetCode,
                assetScale: debitAmount.assetScale,
                value: debitAmount.value
              }
            },
            identifier: wallet.id
          }
        ]
      },
      interact: {
        start: ['redirect'],
        
        finish: {
          method: "redirect",
          // This is where you can (optionally) redirect a user to after going through interaction.
          // Keep in mind, you will need to parse the interact_ref in the resulting interaction URL,
          // and pass it into the grant continuation request.
          uri: "http://localhost:5173/wallet",
          nonce: crypto.randomUUID(),
        },
      }
    }
  )
}

const grantService = {createIncomingGrant,createQuoteGrant,createOutgoingPaymentGrant};

export default grantService;
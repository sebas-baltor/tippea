import interledgerClient from "@/config/interledger-client";
async function getWalletAddress ({walletId}:{walletId:string}){
    return await interledgerClient.walletAddress.get({
            url: walletId
        })
}

const walletService = {getWalletAddress};

export default walletService;
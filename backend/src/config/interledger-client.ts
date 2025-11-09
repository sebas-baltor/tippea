import { createAuthenticatedClient } from "@interledger/open-payments";
import { fileURLToPath } from "url";
import dotenv from "dotenv"

dotenv.config({
// path: fileURLToPath(join(import.meta.url, "..", "..", ".env")),
path: fileURLToPath(new URL(".env",new URL ("../..",import.meta.url))),
});

// console.log(dotenv);

const WALLET_ADDRESS="https://ilp.interledger-test.dev/it_receiver"
const KEY_ID="72aedbe1-e5e9-40d2-8d0b-c80076471f5b"
const PRIVATE_KEY_PATH=process.env.PRIVATE_KEY_PATH || ""

console.log(PRIVATE_KEY_PATH);

const interledgerClient = await createAuthenticatedClient({
      walletAddressUrl:WALLET_ADDRESS || "",
      privateKey: PRIVATE_KEY_PATH,
      keyId:KEY_ID,
    });

export default interledgerClient;
export type InterledgerWalletInfo = {
  id: string;
  publicName: string;
  assetCode: string;
  assetScale: number;
  authServer: string;
  resourceServer: string;
  cardService?: string;
};

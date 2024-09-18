import { Transak, TransakConfig } from '@transak/transak-sdk';

type InitializeTransakProps = {
  walletAddress?: string;
  email?: string;
  productsAvailed?: string;
  onSuccess?: (orderData: any) => void;
  onFailure?: () => void;
};

export const initializeTransak = ({
  walletAddress,
  email,
  productsAvailed = 'BUY,SELL',
  onSuccess,
  onFailure,
}: InitializeTransakProps) => {
  const transakConfig: TransakConfig = {
    apiKey: String(process.env.NEXT_PUBLIC_TRANSAK_PUBLISHABLE_KEY),
    environment:
      String(process.env.NEXT_PUBLIC_ENVIRONMENT) === 'PRODUCTION'
        ? Transak.ENVIRONMENTS.PRODUCTION
        : Transak.ENVIRONMENTS.STAGING,
    walletAddress,
    email,
    defaultNetwork: 'solana',
    defaultCryptoCurrency: 'USDC',
    cryptoCurrencyList: 'USDC',
    networks: 'solana',
    productsAvailed,
    hideMenu: true,
    widgetHeight: '520px',
    widgetWidth: '500px',
    disableWalletAddressForm:true
  };

  const transak = new Transak(transakConfig);

  transak.init();

  Transak.on(Transak.EVENTS.TRANSAK_WIDGET_CLOSE, () => {
    transak.close();
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
    if (onSuccess) onSuccess(orderData);
    transak.close();
  });

  Transak.on(Transak.EVENTS.TRANSAK_ORDER_FAILED, (errorData) => {
    if (onFailure) onFailure();
    transak.close();
  });
};

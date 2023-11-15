import { useDispatch } from 'react-redux';
import { counterActions } from '@/store/store';
import { Web3Auth } from '@web3auth/modal';
import swal from 'sweetalert';

export const useVerification = () => {
  const dispatch = useDispatch();
  const verificationCheck = async (user) => {
    const chainConfig = {
      chainNamespace: 'solana',
      chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
      rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
      displayName: 'Solana Mainnet',
      blockExplorer: 'https://explorer.solana.com',
      ticker: 'SOL',
      tickerName: 'Solana',
    };

    const web3auth = new Web3Auth({
      // For Production
      // clientId: "",
      clientId: process.env.NEXT_PUBLIC_PROD_CLIENT_ID,

      // For Development
      // clientId: process.env.NEXT_PUBLIC_DEV_CLIENT_ID,
      web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
      chainConfig: chainConfig,
    });

    await web3auth.initModal();

    // await web3auth.connect();

    let userInfo;

    try {
      userInfo = await web3auth.getUserInfo();
    } catch (err) {
      localStorage.removeItem('openlogin_store');
      swal({
        title: 'oops!',
        text: "Couldn't get user info. Kindly try again",
      });
      return;
    }

    if (user.KYCStatusId === 2) {
      dispatch(counterActions.additionalInfoModal());
    } else if (user.categoryId === 0 && user.KYCStatusId === 1) {
      swal({
        title: 'Sorry!',
        text: 'Your KYC is pending. kindly check back later.',
        // timer: 3000
      });
    } else if (
      user.categoryId == 0 &&
      (user.KYCStatusId == 0 || user.KYCStatusId == 3)
    ) {
      swal({
        title: 'Sorry!',
        text: 'Your KYC is yet to be completed. You will be redirected now to complete it.',
        timer: 2000,
      });

      console.log({
        user,
        x: process.env.NEXT_PUBLIC_TEMPLATE_ID,
        y: process.env.NEXT_PUBLIC_ENVIRONMENT_ID,
      });

      const client = new Persona.Client({
        templateId: process.env.NEXT_PUBLIC_TEMPLATE_ID,
        referenceId: user?.id,
        environmentId: process.env.NEXT_PUBLIC_ENVIRONMENT_ID,
        onReady: () => client.open(),
        onComplete: ({ inquiryId, status, fields }) => {
          // console.log(`Completed inquiry ${inquiryId} with status ${status}`);
        },
      });
    }
  };

  return { verificationCheck };
};

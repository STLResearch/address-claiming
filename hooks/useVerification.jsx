// import { useDispatch } from 'react-redux';
// import { counterActions } from '@/store/store';
// import { Web3Auth } from '@web3auth/modal';
// import swal from 'sweetalert';

// export const useVerification = () => {
//   const dispatch = useDispatch();
//   const verificationCheck = async (user) => {
//     const chainConfig = {
//       chainNamespace: 'solana',
//       chainId: '0x1', // Please use 0x1 for Mainnet, 0x2 for Testnet, 0x3 for Devnet
//       rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET,
//       displayName: 'Solana Mainnet',
//       blockExplorer: 'https://explorer.solana.com',
//       ticker: 'SOL',
//       tickerName: 'Solana',
//     };

//     const web3auth = new Web3Auth({
//       clientId: process.env.NEXT_PUBLIC_CLIENT_ID,

//       web3AuthNetwork: process.env.NEXT_PUBLIC_AUTH_NETWORK,
//       chainConfig: chainConfig,
//     });

//     await web3auth.initModal();

//     try {
//       await web3auth.getUserInfo();
//     } catch (err) {
//       localStorage.removeItem('openlogin_store');
//       swal({
//         title: 'oops!',
//         text: "Couldn't get user info. Kindly try again",
//       });
//       return;
//     }

//     // if (user.KYCStatusId === 2) {
//     //   dispatch(counterActions.additionalInfoModal());
//     // } else if (user.categoryId === 0 && user.KYCStatusId === 1) {
//     //   swal({
//     //     title: 'Sorry!',
//     //     text: 'Your KYC is pending. kindly check back later.',
//     //   });
//     // } else if (
//     //   user.categoryId == 0 &&
//     //   (user.KYCStatusId == 0 || user.KYCStatusId == 3)
//     // ) {
//     //   swal({
//     //     title: 'Sorry!',
//     //     text: 'Your KYC is yet to be completed. You will be redirected now to complete it.',
//     //     timer: 4000,
//     //   });

//     // }
//     dispatch(counterActions.additionalInfoModal());
//     const client = new Persona.Client({
//       templateId: process.env.NEXT_PUBLIC_TEMPLATE_ID,
//       referenceId: user?.id,
//       environmentId: process.env.NEXT_PUBLIC_ENVIRONMENT_ID,
//       onReady: () => client.open(),
//     });
//   };

//   return { verificationCheck };
// };

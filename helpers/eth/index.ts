
import Web3 from 'web3'

import tokenMessengerAbi from './abis/cctp/TokenMessenger.json'

import usdcAbi from './abis/Usdc.json'
import { AMOUNT,  ETH_TESTNET_RPC, RECIPIENT_ADDRESS } from './eth_const';
import { PublicKey } from '@solana/web3.js'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';

const waitForTransaction = async(web3:any, txHash:any) => {
    let transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
    while(transactionReceipt != null && transactionReceipt.status === 'FALSE') {
        transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
        await new Promise(r => setTimeout(r, 4000));
    }
    return transactionReceipt;
}

// export const depositAndBurnUsdc = async() => {
//     const web3 = new Web3(ETH_TESTNET_RPC);
    
//     // Add ETH private key used for signing transactions
//     const ethSigner = web3.eth.accounts.privateKeyToAccount(ETH_PRIVATE_KEY);
//     web3.eth.accounts.wallet.add(ethSigner);


    
//     // Testnet Contract Addresses
//     const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS = "0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5";
//     const USDC_ETH_CONTRACT_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
     
//     // initialize contracts using address and ABI
//     const ethTokenMessengerContract = new web3.eth.Contract(tokenMessengerAbi, ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, {from: ethSigner.address});
//     const usdcEthContract = new web3.eth.Contract(usdcAbi, USDC_ETH_CONTRACT_ADDRESS, {from: ethSigner.address});
     
//     // AVAX destination address
//     const mintRecipient = RECIPIENT_ADDRESS;
//     const destinationAddressInBytes32 = bs58.decode(mintRecipient)
//         const SOLANA_DESTINATION_DOMAIN = 5;

//     // Amount that will be transferred
//     const amount = AMOUNT;

//     // STEP 1: Approve messenger contract to withdraw from our active eth address
//     const approveTxGas = await usdcEthContract.methods.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount).estimateGas()
//     const approveTx = await usdcEthContract.methods.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount).send({gas: approveTxGas.toString(),})
//     const approveTx1 =  usdcEthContract.methods.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount).populateTransaction()
//     const approveTxReceipt = await waitForTransaction(web3, approveTx.transactionHash);
//     console.log('ApproveTxReceipt: ', approveTxReceipt)

//     // STEP 2: Burn USDC
//     const burnTxGas = await ethTokenMessengerContract.methods.depositForBurn(amount, SOLANA_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS).estimateGas();
//     const burnTx = await ethTokenMessengerContract.methods.depositForBurn(amount, SOLANA_DESTINATION_DOMAIN, destinationAddressInBytes32, USDC_ETH_CONTRACT_ADDRESS).send({gas: burnTxGas.toString()});
//     const burnTxReceipt = await waitForTransaction(web3, burnTx.transactionHash);
//     console.log('BurnTxReceipt: ', burnTxReceipt)

//     // STEP 3: Retrieve message bytes from logs
//     const transactionReceipt = await web3.eth.getTransactionReceipt(burnTx.transactionHash);
//     const eventTopic = web3.utils.keccak256('MessageSent(bytes)')
//     const log = transactionReceipt?.logs?.find((l) => {
//         let temp=l.topics?l.topics[0]:"";
//                 return temp === eventTopic
//             })
//     const messageBytes = web3.eth.abi.decodeParameters(['bytes'], log?.data as string)[0]
//     const messageHash = web3.utils.keccak256(messageBytes as string);

//     console.log(`MessageBytes: ${messageBytes}`)
//     console.log(`MessageHash: ${messageHash}`)

//     // STEP 4: Fetch attestation signature
//     let attestationResponse = {status: 'pending',attestation:""};
//     while(attestationResponse.status != 'complete') {
//         const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
//         attestationResponse = await response.json()
//         console.log({attestationResponse});
//         await new Promise(r => setTimeout(r, 2000));
//     }

//     const attestationSignature = attestationResponse.attestation;
//     console.log({messageBytes, attestationSignature})

//     return {messageBytes, attestationSignature}

// };
export const approveTxVals = async (address: string,userata:string) => {
	const web3 = new Web3(ETH_TESTNET_RPC);

	
	//web3.eth.accounts.wallet.add(ethSigner);

	// Testnet Contract Addresses
	const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS =
		"0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5";
	const USDC_ETH_CONTRACT_ADDRESS =
		"0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

	// initialize contracts using address and ABI
	const ethTokenMessengerContract = new web3.eth.Contract(
		tokenMessengerAbi,
		ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS,
		{ from: address }
	);
	const usdcEthContract = new web3.eth.Contract(
		usdcAbi,
		USDC_ETH_CONTRACT_ADDRESS,
		{ from: address }
	);

	// AVAX destination address
	const mintRecipient = userata;
	const destinationAddressInBytes32 = bs58.decode(mintRecipient);
	const SOLANA_DESTINATION_DOMAIN = 5;

	// Amount that will be transferred
	const amount = AMOUNT;

	const approveTx = await usdcEthContract.methods
		.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, amount)
		.populateTransaction();
	let approveTxData = { to: approveTx.to, data: approveTx.data };
	console.log({ approveTxData });

	return approveTxData;
};
export const burnTxVals = async (address: string,userata:string) => {
	const web3 = new Web3(ETH_TESTNET_RPC);

	// Add ETH private key used for signing transactions
	
	// Testnet Contract Addresses
	const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS =
		"0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5";
	const USDC_ETH_CONTRACT_ADDRESS =
		"0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

	// initialize contracts using address and ABI
	const ethTokenMessengerContract = new web3.eth.Contract(
		tokenMessengerAbi,
		ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS,
		{ from: address }
	);

	// AVAX destination address
	const mintRecipient = userata;
	const destinationAddressInBytes32 = bs58.decode(mintRecipient);
	const SOLANA_DESTINATION_DOMAIN = 5;

	// Amount that will be transferred
	const amount = 1;

	const burnTxGas = await ethTokenMessengerContract.methods
		.depositForBurn(
			amount,
			SOLANA_DESTINATION_DOMAIN,
			destinationAddressInBytes32,
			USDC_ETH_CONTRACT_ADDRESS
		)
		.estimateGas();
	const burnTx = ethTokenMessengerContract.methods
		.depositForBurn(
			1,
			SOLANA_DESTINATION_DOMAIN,
			destinationAddressInBytes32,
			USDC_ETH_CONTRACT_ADDRESS
		)
		.populateTransaction({ gas: burnTxGas.toString() });
	let burnTxData = {
		to: burnTx.to,
		data: burnTx.data,
		gas: burnTxGas,
	};
	console.log({ burnTxData });
	return burnTxData;
};

export const msgBytes = async (txhash: string) => {
	const web3 = new Web3(ETH_TESTNET_RPC);
	const transactionReceipt = await web3.eth.getTransactionReceipt(txhash);
	const eventTopic = web3.utils.keccak256("MessageSent(bytes)");
	const log = transactionReceipt?.logs?.find((l) => {
		let temp = l.topics ? l.topics[0] : "";
		return temp === eventTopic;
	});
	const messageBytes = web3.eth.abi.decodeParameters(
		["bytes"],
		log?.data as string
	)[0];
	const messageHash = web3.utils.keccak256(messageBytes as string);

	console.log(`MessageBytes: ${messageBytes}`); //
	console.log(`MessageHash: ${messageHash}`); //
	return { messageBytes, messageHash };
};

export const checkAttestation = async (
	messageBytes: string,
	messageHash: string
) => {
	let attestationResponse = { status: "pending", attestation: "" };
	while (attestationResponse.status != "complete") {
		const response = await fetch(
			`https://iris-api-sandbox.circle.com/attestations/${messageHash}`
		);
		attestationResponse = await response.json();
		console.log({ attestationResponse });
		await new Promise((r) => setTimeout(r, 2000));
	}

	const attestationSignature = attestationResponse.attestation;
	console.log({ messageBytes, attestationSignature });

	return { messageBytes, attestationSignature };
};

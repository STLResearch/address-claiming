
import Web3 from 'web3'

import tokenMessengerAbi from './abis/cctp/TokenMessenger.json'

import usdcAbi from './abis/Usdc.json'
import { AMOUNT,   } from './eth_const';
import { PublicKey } from '@solana/web3.js'
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
//import 'dotenv/config'
const waitForTransaction = async(web3:any, txHash:any) => {
    let transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
    while(transactionReceipt != null && transactionReceipt.status === 'FALSE') {
        transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
        await new Promise(r => setTimeout(r, 4000));
    }
    return transactionReceipt;
}
const web3 = new Web3(process.env.NEXT_PUBLIC_ETH_TESTNET_RPC);
const ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS =
		process.env.NEXT_PUBLIC_ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS;
	const USDC_ETH_CONTRACT_ADDRESS =
		process.env.NEXT_PUBLIC_USDC_ETH_CONTRACT_ADDRESS;

console.log(process.env.NEXT_PUBLIC_ETH_TESTNET_RPC)
export const approveTxVals = async (address: string,userata:string,usdcAmount:number) => {
	


	//web3.eth.accounts.wallet.add(ethSigner);

	// Testnet Contract Addresses
	
	// initialize contracts using address and ABI

	const usdcEthContract = new web3.eth.Contract(
		usdcAbi,
		USDC_ETH_CONTRACT_ADDRESS,
		{ from: address }
	);

	// AVAX destination address
	
	// Amount that will be transferred
	
	const approveTx = await usdcEthContract.methods
		.approve(ETH_TOKEN_MESSENGER_CONTRACT_ADDRESS, usdcAmount)
		.populateTransaction();
	let approveTxData = { to: approveTx.to, data: approveTx.data };

	return approveTxData;
};
export const burnTxVals = async (address: string,userata:string,usdcAmount:number) => {

	// Add ETH private key used for signing transactions
	
	// Testnet Contract Addresses
	
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
	

	const burnTxGas = await ethTokenMessengerContract.methods
		.depositForBurn(
			usdcAmount,
			SOLANA_DESTINATION_DOMAIN,
			destinationAddressInBytes32,
			USDC_ETH_CONTRACT_ADDRESS
		)
		.estimateGas();
	const burnTx = ethTokenMessengerContract.methods
		.depositForBurn(
			usdcAmount,
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
		
		await new Promise((r) => setTimeout(r, 2000));
	}

	const attestationSignature = attestationResponse.attestation;
	console.log({ messageBytes, attestationSignature });

	return { messageBytes, attestationSignature };
};

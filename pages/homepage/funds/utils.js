 const getTokeBalance = async (blockchainAddress) => {
    if(!blockchainAddress) throw new Error('cannot get token balance of wallet address: ',walletAddress)
    const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
            blockchainAddress,
            {
                mint: process.env.NEXT_PUBLIC_MINT_ADDRESS,
            },
            {
                encoding: 'jsonParsed',
            },
        ],
    };

    const result =  await fetch(process.env.NEXT_PUBLIC_SOLANA_API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    const response = await result.json()

    if(!result.ok){
        throw new Error(response.error)
    }
    if(response.result.value.length < 1){
        return 0
    }
    return response.result.value[0].account.data.parsed.info.tokenAmount
    .uiAmountString
        
}
export default getTokeBalance
export const getTokeBalance = async () => {
    const data = {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
            user.blockchainAddress,
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
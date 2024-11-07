import { getRoutes, RoutesRequest } from "@lifi/sdk";
import { Address, buildOperation, BridgePlugin, buildTransaction, } from "klaster-sdk";
import { Hex } from "viem";

export const LiFiBrigePlugin: BridgePlugin = async (data) => {

    const routesRequest: RoutesRequest = {
        fromChainId: data.sourceChainId,
        toChainId: data.destinationChainId,
        fromTokenAddress: data.sourceToken,
        toTokenAddress: data.destinationToken,
        fromAmount: data.amount.toString(),
        options: {
            order: "FASTEST",
        },
    };

    const result = await getRoutes(routesRequest);
    const route = result.routes.at(0)

    if (!route) {
        throw Error('1');
    }

    console.log(route);

    const routeSteps = route.steps.map(step => {
        if (!step.transactionRequest) { throw Error('2') }
        const { to, gasLimit, data, value } = step.transactionRequest
        if (!to || !gasLimit || !data || !value) { throw Error('3') }
        return buildTransaction({
            to: to as Address,
            gasLimit: BigInt(gasLimit),
            data: data as Hex,
            value: BigInt(value)
        }).toTransaction()
    })

    return {
        receivedOnDestination: BigInt(route.toAmountMin),
        txBatch: buildOperation(data.sourceChainId, routeSteps)
    }
};
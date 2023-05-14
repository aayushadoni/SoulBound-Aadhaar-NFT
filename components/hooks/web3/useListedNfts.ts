import { CryptoHookFactory } from "@_types/hooks";
import useSWR from "swr";
import { Nft } from "@_types/nft";

type UseListedNftsResponse = {}
type ListedNftsHookFactory = CryptoHookFactory<Nft[], UseListedNftsResponse>

export type UseListedNftsHook = ReturnType<ListedNftsHookFactory>

export const hookFactory: ListedNftsHookFactory = ({contract}) => () => {
    const {data, ...swr} = useSWR(
        contract ? "web3/useListedNfts" : null,
        async () => {
            const nfts = [] as Nft[];

            const coreNfts = await contract!.getAllAadhaarNfts();

            for (let i = 0; i < coreNfts.length; i++) {
                const item = coreNfts[i];
                const tokenURI = await contract!.tokenURI(item.tokenId);
                const metaRes = await fetch(tokenURI);
                const meta = await metaRes.json();

                nfts.push({
                    receiver:item.Address,
                    tokenId: item.tokenId.toNumber(),
                    creator:item.Address,
                    meta
                })
            }

            return nfts;
        }
    )
    return {
        ...swr,
        data: data || [],
    };
}
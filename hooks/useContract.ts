import { useMemo } from 'react';
import { Abi, WalletClient } from 'viem';
import { getContract } from '../utils/getContract';
import { babtABI, collabABI, erc1155ABI } from '../abis';
import { Address, useContractRead, useNetwork, usePublicClient, useWalletClient } from 'wagmi';
import { BABT_ADDRESSES, COLLAB_ADDRESS } from '../constants/addresses';

export function useContract<TAbi extends Abi>(address?: Address, abi?: TAbi, chainId?: number) {
  const publicClient = usePublicClient({ chainId });
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!address || !abi) return null;
    try {
      return getContract({
        abi,
        address,
        publicClient: publicClient,
        walletClient: walletClient as WalletClient,
      });
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [abi, address, publicClient, walletClient]);
}

export function useBABTBalanceOf({ address }: { address?: Address }) {
  const { chain } = useNetwork();
  const babtAddress = chain ? BABT_ADDRESSES[chain.id] : undefined;

  return useContractRead({
    address: babtAddress,
    abi: babtABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
  });
}

export function useCollabContract() {
  return useContract(COLLAB_ADDRESS, collabABI);
}

export function useERC1155Contract(contractAddress?: Address) {
  return useContract(contractAddress, erc1155ABI);
}

export function useERC1155BalanceOfBatch({
  contractAddress,
  accounts,
  tokenIds,
}: {
  contractAddress?: Address;
  accounts?: Address[];
  tokenIds?: bigint[];
}) {
  return useContractRead({
    address: contractAddress,
    abi: erc1155ABI,
    functionName: 'balanceOfBatch',
    args: accounts && tokenIds ? [accounts, tokenIds] : undefined,
    enabled: !!contractAddress && !!accounts?.length && !!tokenIds?.length && accounts.length === tokenIds.length,
  });
}

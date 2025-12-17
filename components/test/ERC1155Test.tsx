import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useERC1155Contract, useERC1155BalanceOfBatch } from '../../hooks/useContract';

const TEST_CONTRACT = '0xf778C45329B9E45c8A1EDcE82E2b89a0e098644d';

export function ERC1155Test() {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();

  const contract = useERC1155Contract(TEST_CONTRACT);
  const { data: balances, isLoading, error } = useERC1155BalanceOfBatch({
    contractAddress: TEST_CONTRACT,
    accounts: address ? [address, address, address] : undefined,
    tokenIds: [BigInt(0), BigInt(1), BigInt(2)],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isConnected) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl bg-white/5 p-4">
      <h2 className="mb-4 text-xl font-bold text-white">ERC-1155 Balances</h2>

      <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
        {isLoading && <p className="text-gray-400">Loading...</p>}
        {error && <p className="text-red-400">Contract not available on testnet</p>}
        {balances && balances.map((balance, index) => (
          <div key={index} className="rounded-xl bg-white/10 p-4">
            <p className="text-sm text-gray-400">Token ID {index}</p>
            <p className="text-2xl font-bold text-white">{balance.toString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ERC1155Test;

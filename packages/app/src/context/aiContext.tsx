import { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FC } from "react";
import { createContext } from "react";
import { TaskService } from "@ensemble-ai/sdk";
import { useWallets } from "@privy-io/react-auth";
import { useMemo } from "react";

const AiContext = createContext({});

export const AiProvider: FC<PropsWithChildren> = ({ children }) => {
  const [taskService, setTaskService] = useState<TaskService | null>(null);

  const { wallets } = useWallets();

  const wallet = useMemo(() => wallets[0], [wallets]);

  useEffect(() => {
    async function initialize() {
      if (wallet) {
        const ethersProvider = await wallet.getEthersProvider();
        const signer = ethersProvider.getSigner();

        setTaskService(
          new TaskService(
            {
              agentRegistryAddress:
                "0x401255453C4a6e66b073bb91cF7B0B5D67FeC81b",
              taskRegistryAddress: "0x9ED3eC1C7D04417B731f606411311368E5EF70EB",
              network: {
                rpcUrl: "https://sepolia.base.org",
                chainId: 84532,
                name: "Sepolia",
              },
            },
            signer as any
          )
        );
      }
    }

    initialize();
  }, [wallet]);

  return (
    <AiContext.Provider
      value={{
        taskService,
      }}
    >
      {children}
    </AiContext.Provider>
  );
};

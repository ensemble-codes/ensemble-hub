import { PropsWithChildren } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FC } from "react";
import { createContext } from "react";
import { TaskService } from "@ensemble-ai/sdk";
import { useWallets } from "@privy-io/react-auth";
import { useMemo } from "react";
import TaskServiceAbi from '@/constants/abi/taskService.abi.json'
import { useContext } from "react";
import { ethers } from "ethers"

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

        const taskServiceContract = new ethers.Contract(
          '0x9ED3eC1C7D04417B731f606411311368E5EF70EB',
          TaskServiceAbi,
        )

        setTaskService(
          new TaskService(
            taskServiceContract,
            signer as unknown as ethers.Signer
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

export const useAiContext = () => useContext(AiContext);

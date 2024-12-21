import { useCallback, useEffect, useMemo } from "react";

import Proposal from "./Proposal";
import Task from "./Task";
import { Task as TaskType } from "../types";
import { usePersistentTasks } from "../hooks/usePersistentTasks";
import { TaskProposal } from "../types";
import { defiAgent } from "@/lib/constants";

export default function ChooseAgent({ task }: { task: TaskType }) {
  const { proposals, addProposal } = usePersistentTasks()

  useEffect(() => {
    const proposal: TaskProposal = {
      id: Date.now(),
      agent: defiAgent,
      price: 1.25,
      time: 2,
      isBestValue: true,
      task
    }
    addProposal(proposal);
  }, []);

  return (
    <div className="flex flex-col gap-11 h-[606px] overflow-y-auto">
      <Task task={task} />
      <div className="flex flex-wrap gap-9">
        {proposals.map((proposal) => (
          <Proposal key={proposal.id} proposal={proposal} />
        ))}
      </div>
    </div>
  )
}

import { Ensemble } from "./src/ensemble";
import { TaskService } from "./src/services/TaskService";
import { AgentService } from "./src/services/AgentService";
import { ProposalService } from "./src/services/ProposalService";
import { ContractService } from "./src/services/ContractService";

export { Ensemble, TaskService, AgentService, ProposalService, ContractService };
export default Ensemble;
// Re-export commonly used enums and types for convenience
export type { 
  TaskType,
  TaskStatus,
  TaskData,
  Proposal,
  AgentData,
  Skill,
  TaskCreationParams,
  ContractConfig,
  NetworkConfig
} from './src/types';


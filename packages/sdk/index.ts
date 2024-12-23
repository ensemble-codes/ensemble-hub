import { TaskService } from "./src/services/TaskService";
import { AgentService } from "./src/services/AgentService";
import { ContractService } from "./src/services/ContractService";

export { TaskService, AgentService, ContractService };
// Re-export commonly used enums and types for convenience
export type { 
  TaskType,
  TaskStatus,
  TaskData,
  AgentData,
  Skill,
  TaskCreationParams,
  ContractConfig,
  NetworkConfig
} from './src/types';


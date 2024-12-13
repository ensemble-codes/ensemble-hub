import { BigNumberish, ethers } from "ethers";
import { TaskCreationParams, TaskData } from "../types";

export class TaskService {
  private taskRegistry: ethers.Contract;
  protected onNewTask: (taskId: string) => void = () => {};

  constructor(taskRegistry: ethers.Contract) {
    this.taskRegistry = taskRegistry;
  }

  /**
   * Creates a new task.
   * @param {TaskCreationParams} params - The parameters for task creation.
   * @returns {Promise<bigint>} A promise that resolves to the task ID.
   */
  async createTask(params: TaskCreationParams): Promise<bigint> {
    const tx = await this.taskRegistry.createTask(params.prompt, params.taskType);
    const receipt = await tx.wait();
    
    const event = this.findEventInReceipt(receipt, "TaskCreated");
    if (!event?.args?.[1]) {
      throw new Error("Task creation failed: No task address in event");
    }
    const taskId = event.args[1];
    return taskId;
  }

  /**
   * Gets data for a specific task.
   * @param {string} taskId - The ID of the task.
   * @returns {Promise<TaskData>} A promise that resolves to the task data.
   */
  async getTaskData(taskId: string): Promise<TaskData> {
    const [id, prompt, taskType, owner, status, assignee] = await this.taskRegistry.tasks(taskId);

    return {
      id,
      prompt,
      taskType,
      assignee: assignee || undefined,
      status,
      owner
    };
  }

  async getTasksByOwner(owner: string): Promise<string[]> {
    return this.taskRegistry.getTasksByOwner(owner);
  }

  /**
   * Completes a task.
   * @param {BigNumberish} taskId - The ID of the task.
   * @param {string} result - The result of the task.
   * @returns {Promise<void>} A promise that resolves when the task is completed.
   */
  async completeTask(taskId: BigNumberish, result: string): Promise<void> {
    try {
      const tx = await this.taskRegistry.completeTask(taskId, result);
      await tx.wait();
    } catch (error) {
      console.error("Completing task failed:", error);
      throw error;
    }
  }

  /**
   * Subscribes to new task creation events.
   */
  public async subscribe() {
    const filter = this.taskRegistry.filters.TaskCreated();

    this.taskRegistry.on(filter, ({ args: [ owner, taskId, prompt, taskType ] }) => {
      console.log(`Owner: ${owner}
        Task ID: ${taskId}
        Prompt: ${prompt}
        Task Type: ${taskType}`);
      this.onNewTask(taskId.toString());
    });
  }

  setOnNewTaskListener(listener: (taskId: string) => void) {
    this.onNewTask = listener;
  } 

  findEventInReceipt(receipt: any, eventName: string): ethers.EventLog {
    const events = receipt.logs.map((log: any) => {
      try {
        const event = this.taskRegistry.interface.parseLog(log);
        return event;
      } catch (e) {
        console.error('error:', e);
        return null;
      }
    }).filter((event: any) => event !== null);
    const event = events?.find((e: { name: string }) => e.name === eventName);
    return event
  }

  // ... other task-related methods
} 
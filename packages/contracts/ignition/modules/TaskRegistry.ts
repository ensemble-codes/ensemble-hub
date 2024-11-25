const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TaskRegistryModule = buildModule("TaskRegistryModule", (m) => {
  const taskRegistry = m.contract("TaskRegistry");

  return { taskRegistry };
});

export default TaskRegistryModule; 
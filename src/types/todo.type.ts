export type TodoData = {
  _id?: number;
  task: string;
  priority: string;
  dueDate: Date | string;
  done: boolean;
};

export type todoFields = { 
  task: string|undefined;
  priority: string|undefined;
  dueDate: string|undefined;
  done: boolean|undefined;
}
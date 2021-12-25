export type CreateTodoInput = {
  userId: number;
  title: string;
  isCompleted: boolean;
};

export type UpdateTodoInput = {
  title?: string;
  isCompleted?: boolean;
};

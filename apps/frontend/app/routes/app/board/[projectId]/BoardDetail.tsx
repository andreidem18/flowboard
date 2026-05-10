import { BoardHeader, TaskForm, Tasks } from "~/features/board/components";

export default function BoardDetail() {
  return (
    <>
      <BoardHeader />
      <Tasks />
      <TaskForm />
    </>
  );
}

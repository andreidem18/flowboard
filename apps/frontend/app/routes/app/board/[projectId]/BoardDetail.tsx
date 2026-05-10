import { Tasks } from "~/features/board/components";
import { BoardHeader } from "~/features/board/components/BoardHeader";

export default function BoardDetail() {
  return (
    <div>
      <BoardHeader />
      <Tasks />
    </div>
  );
}

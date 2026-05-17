import { cn } from "~/lib/utils";

interface Props {
  isDropTarget: boolean;
}

export const DropIndicator = ({ isDropTarget }: Props) => {
  return (
    <div
      className={cn(
        "mx-auto mb-0.5 h-1 w-[90%] rounded-full bg-blue-400 opacity-0 duration-200",
        isDropTarget && "opacity-100"
      )}
    ></div>
  );
};

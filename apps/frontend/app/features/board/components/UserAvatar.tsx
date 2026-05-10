import React from "react";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";

interface Props {
  userName: string;
}

export const UserAvatar = ({ userName }: Props) => {
  return (
    <Avatar className="h-6 w-6">
      <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

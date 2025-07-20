"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { ChartNoAxesGantt } from "lucide-react";
import React from "react";

const UserMenu = () => {
  const { user } = useUser(); // Get current user information from Clerk

  if (!user) {
    return null; // or return a fallback UI
  }

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-16 h-16",
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Link
          label="My Profile"
          labelIcon={<ChartNoAxesGantt size={15} />}
          href={`/view-profile/${user.id}`}
        />
        <UserButton.Action label="manageAccount" />
      </UserButton.MenuItems>
    </UserButton>
  );
};

export default UserMenu;

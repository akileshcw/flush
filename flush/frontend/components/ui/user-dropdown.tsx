"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { RiSettingsLine, RiTeamLine, RiLogoutBoxLine } from "@remixicon/react";
import { useRouter } from "next/navigation";

//Next-auth Implementation imports
// import { signOut, useSession } from "next-auth/react";
// import { nextSignOut } from "@/actions/auth.action";

export default function UserDropdown() {
  //Next-auth Implementation
  // const { data: session } = useSession();
  // console.log("the session is", session);
  // if (!session || !session.user) router.push("/login");
  // const name = session?.user?.name;

  const session = authClient.useSession();
  const name = session?.data?.user.name;
  const email = session?.data?.user.email;

  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar className="size-8">
            <AvatarImage
              src="https://res.cloudinary.com/dlzlfasou/image/upload/v1741345506/user_sam4wh.png"
              width={32}
              height={32}
              alt="Profile image"
            />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64" align="end">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-foreground">
            {name?.trim().toLocaleUpperCase()}
          </span>
          <span className="truncate text-xs font-normal text-muted-foreground">
            {email ?? "No email provided"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => router.push("/dashboard/account-settings")}
          >
            <RiSettingsLine
              size={16}
              className="opacity-60"
              aria-hidden="true"
            />
            <span>Account settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RiTeamLine size={16} className="opacity-60" aria-hidden="true" />
            <span>Affiliate area</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          //Next-auth Implementation
          // onClick={() => nextSignOut()}
          onClick={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push("/login");
                },
              },
            });
          }}
        >
          <RiLogoutBoxLine
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

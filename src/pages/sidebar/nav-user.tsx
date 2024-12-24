import React from 'react';
import { BadgeCheck, CreditCard, LogOut, ChevronsUpDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';
import { logout } from '@/redux/slices/authSlice';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/componentss/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/componentss/ui/sidebar';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

// Define the shape of your Redux state
interface AuthState {
  currentUser: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({
  user
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    try {
      dispatch(logout());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="bg-secondary text-sidebar-accent-foreground hover:bg-secondary data-[state=open]:bg-secondary data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight text-white">
                <span className="truncate font-semibold dark:text-white">
                  {user?.name}
                </span>
                <span className="truncate text-xs dark:text-white">
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-44 rounded-lg bg-secondary text-white"
            side={isMobile ? 'right' : 'bottom'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate('/account-settings')}
              >
                <BadgeCheck />
                Account settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate('/website')}
              >
                <CreditCard />
                Website
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => handleLogout()}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

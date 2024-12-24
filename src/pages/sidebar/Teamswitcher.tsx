import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/componentss/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/componentss/ui/sidebar';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/componentss/ui/tooltip';

import { useSelector } from 'react-redux';
export function TeamSwitcher({
  teams
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
    sidebar: React.ElementType;
  }[];
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  const { currentUser } = useSelector((state: any) => state.auth);
  const { open, setOpen } = useSidebar();
  const handleRedirect = () => {
    navigate('/');
  };
  return (
    <div className="relative">
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
              // className="bg-transparent hover:bg-accent hover:text-black data-[state=open]:bg-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => setOpen(true)}
                    className={`${!open ? 'size-8 border border-primary text-primary hover:bg-primary hover:text-white' : 'bg-transparent text-sidebar-primary-foreground'} flex aspect-square items-center justify-center rounded-lg`}
                  >
                    {!open ? (
                      <activeTeam.sidebar
                        size={16}
                        className=""
                        strokeWidth={3}
                      />
                    ) : (
                      <img
                        src={currentUser?.logo}
                        className="h-[3.5rem]"
                        alt="logo"
                        onClick={handleRedirect}
                      />
                    )}
                  </div>
                </TooltipTrigger>
                {!open && (
                  <TooltipContent side="right">
                    <p>Open Sidebar</p>
                  </TooltipContent>
                )}
              </Tooltip>
              {/* )} */}
              {/* <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-secondary">
                  {activeTeam.name}
                </span>
                <span className="truncate font-semibold text-secondary">
                  {activeTeam.plan}
                </span>
              </div> */}
              {/* <ChevronsUpDown className="ml-auto" /> */}
            </SidebarMenuButton>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {!isMobile && (
        <SidebarTrigger
          className={`absolute z-50 mx-2 my-3 ml-auto p-4 ${isMobile ? 'left-0 bg-accent' : open ? 'right-0' : 'hidden'} top-[-0.3rem] cursor-pointer hover:text-primary`}
        />
      )}
    </div>
  );
}

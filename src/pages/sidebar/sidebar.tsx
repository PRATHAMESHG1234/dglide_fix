import {
  Home,
  LayoutDashboard,
  Building,
  Wrench,
  UserCog,
  TvMinimal,
  Settings2,
  ArrowDownUp,
  CloudLightning,
  RectangleEllipsis,
  BookImage,
  CircleCheckBig,
  Workflow,
  Bot,
  Scale,
  BrainCircuit,
  ChevronDown,
  Send,
  Combine,
  ChevronRight,
  SquareCheck,
  FileSliders,
  AlignJustify,
  LibraryBig,
  Filter,
  SquarePlus,
  CircleGauge,
  Blocks,
  ChartSpline,
  Newspaper,
  ChevronUp
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar
} from '@/componentss/ui/sidebar';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/componentss/ui/tooltip';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/componentss/ui/collapsible';

import { TeamSwitcher } from './Teamswitcher';
import { Button } from '@/componentss/ui/button';
import { NavUser } from './nav-user';
import { useSelector } from 'react-redux';
import { fetchModuleFormNestedTree } from '../../services/module';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';
import { SearchForm } from './searchForm';

interface RootState {
  auth: any;
}
export function AppSidebar({ currentModule }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { open, isMobile } = useSidebar();
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [nestedData, setNestedData] = useState([]);
  const [filteredData, setFilteredData] = useState<any[]>(nestedData);

  const handleSearch = (query: string) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      setFilteredData(nestedData);
      return;
    }

    const filtered = nestedData
      .map((module) => {
        const filteredForms = module.forms.filter((form) =>
          form.displayName.toLowerCase().includes(normalizedQuery)
        );

        if (filteredForms.length > 0) {
          return { ...module, forms: filteredForms };
        }

        return null;
      })
      .filter(Boolean);

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (nestedData.length > 0) {
      setFilteredData(nestedData);
    }
  }, [nestedData]);

  function getFirstNameFromEmail(email: string): string {
    const username: string = email?.split('@')[0];
    const firstName: string = username?.split('.')[0];
    return (
      firstName?.charAt(0).toUpperCase() + firstName?.slice(1).toLowerCase()
    );
  }

  const dashboardItems = (currentModule) => [
    {
      id: 'config',
      name: 'Manage Charts',
      icon: CircleGauge,
      path: `app/${currentModule?.name}/dashboard/manage-charts`
    },
    {
      id: 'build',
      name: 'Build Dashboard',
      icon: Blocks,
      path: `app/${currentModule?.name}/dashboard/build-dash`
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: ChartSpline,
      path: `app/${currentModule?.name}/dashboard/analytics`
    }
  ];

  const adminItems = [
    {
      path: '/admin/user-profile',
      name: 'User Profile',
      icon: UserCog,
      condition: true
    },
    {
      path: '/fields',
      name: 'Fields',
      icon: RectangleEllipsis,
      condition: true
    },
    {
      path: currentModule ? `app/${currentModule.name}/actions` : null,
      name: 'Actions',
      icon: CloudLightning,
      condition: !!currentModule
    },
    {
      path: currentModule ? `app/${currentModule.name}/ui-rules` : null,
      name: 'UI-Rules',
      icon: Scale,
      condition: !!currentModule
    },
    {
      path: '/admin/channels',
      name: 'Channels',
      icon: TvMinimal,
      condition: true
    },
    {
      path: '/admin/operation',
      name: 'Operation',
      icon: Settings2,
      condition: true
    },
    {
      path: '/admin/importExport',
      name: 'Import/Export',
      icon: ArrowDownUp,
      condition: true
    },
    {
      path: '/admin/integration',
      name: 'Marketplace',
      icon: Combine,
      condition: true
    },
    {
      path: '/catalogflow',
      name: 'Catalogs',
      icon: BookImage,
      condition: true
    },
    { path: '/workflow', name: 'Workflow', icon: Workflow, condition: true }
    // { path: '/portal', name: 'Portal', icon: CircleCheckBig, condition: true },
    // { path: '/chatbot', name: 'Chatbot', icon: Bot, condition: true },
    // { path: '/ai', name: 'AI', icon: BrainCircuit, condition: true }
  ];

  const redirect = (item) => {
    const { module, form, filter } = item;

    if (filter?.type === 'staticFilter') {
      const targetRoute =
        filter.name === 'Add New Record'
          ? `/app/${module?.name}/${form?.name}/modify`
          : `/app/${module?.name}/${form?.name}`;
      navigate(targetRoute);
    } else {
      navigate(`/app/${module?.name}/${form?.name}`, {
        state: { data: filter?.conditions }
      });
    }
  };

  const teams = [
    {
      name: 'DIGITAL',
      logo: Send,
      sidebar: AlignJustify,
      plan: 'GLIDE'
    }
  ];

  const user = {
    name: getFirstNameFromEmail(currentUser?.username),
    email: currentUser?.username,
    avatar: 'https://ui.shadcn.com/avatars/shadcn.jpg'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchModuleFormNestedTree();
        const data = res?.result;

        const updatedData = data.map((module) => {
          return {
            ...module,
            forms: module.forms.map((form) => {
              return {
                ...form,
                filters: [
                  {
                    name: 'Add New Record',
                    type: 'staticFilter'
                  },
                  ...(form.filters || [])
                ]
              };
            })
          };
        });

        setNestedData(updatedData);
      } catch (error) {
        console.error('Error fetching nested tree:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative">
      <Sidebar className="z-40" collapsible="icon" variant="sidebar">
        <SidebarHeader className="mt-2">
          <TeamSwitcher teams={teams} />
          {/* <img src={currentUser?.logo} className="h-16 w-44" alt="logo" /> */}
          {open && (
            <SearchForm nestedData={nestedData} onSearch={handleSearch} />
          )}
        </SidebarHeader>
        <SidebarContent>
          {/* Home Link in General Section */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="space-y-1">
                  <SidebarMenuButton
                    asChild
                    tooltip={currentUser?.localizationJson['home']}
                    className="text-black"
                  >
                    <Button
                      variant={'ghost'}
                      className={`w-full justify-start px-4 py-2 hover:bg-secondary hover:font-bold active:bg-secondary dark:text-white ${
                        location.pathname === '/'
                          ? 'bg-secondary font-bold text-white hover:bg-secondary hover:text-white active:bg-secondary'
                          : 'font-medium hover:bg-secondary hover:text-white'
                      } active:bg-secondary data-[active=true]:bg-secondary data-[state=open]:hover:bg-secondary`}
                      onClick={() => navigate('/')}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      <span>{currentUser?.localizationJson['home']}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Module form section */}
          <Collapsible defaultOpen={currentUser?.role?.level != 1}>
            <SidebarGroup>
              <SidebarMenu>
                {filteredData?.map((module) => (
                  <Collapsible
                    key={module.displayName}
                    asChild
                    className="group/collapsible"
                    defaultOpen={currentUser?.role?.level != 1}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild className="cursor-pointer">
                        <SidebarMenuButton
                          asChild
                          tooltip={module.displayName}
                          className={`font-medium text-black hover:bg-secondary hover:font-bold hover:text-white active:bg-secondary active:text-white ${
                            location.pathname === `/module/${module.id}`
                              ? 'bg-secondary font-bold text-white'
                              : ''
                          } active:bg-secondary data-[active=true]:bg-secondary data-[state=open]:hover:bg-secondary`}
                        >
                          <span className="flex items-center space-x-2 ps-4">
                            <Avatar className="h-5 w-5 bg-secondary">
                              <AvatarImage
                                src={
                                  module?.logo &&
                                  `${process.env.REACT_APP_STORAGE_URL}/${module?.logo}`
                                }
                              />
                              <AvatarFallback className="bg-secondary text-xs font-semibold text-white dark:text-slate-800">
                                {module?.displayName &&
                                typeof module.displayName === 'string'
                                  ? module.displayName[0]?.toUpperCase()
                                  : ''}
                              </AvatarFallback>
                            </Avatar>
                            <span>{module.displayName}</span>
                          </span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      {module.forms?.length ? (
                        <>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CollapsibleTrigger
                                asChild
                                className="bg-transparent hover:bg-accent hover:text-black"
                              >
                                <SidebarMenuAction className="transform transition-transform data-[state=open]:rotate-90">
                                  <ChevronRight />
                                  <span className="sr-only">Toggle</span>
                                </SidebarMenuAction>
                              </CollapsibleTrigger>
                            </TooltipTrigger>
                          </Tooltip>

                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {module.forms
                                ?.filter((ele) => ele.showOnMenu)
                                ?.map((form) => (
                                  <Collapsible
                                    key={form.displayName}
                                    defaultOpen={currentUser?.role?.level != 1}
                                  >
                                    <SidebarMenuItem>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <SidebarMenuButton
                                            asChild
                                            className={`cursor-pointer ${
                                              location.pathname.substring(
                                                location.pathname.lastIndexOf(
                                                  '/'
                                                ) + 1
                                              ) === form?.name
                                                ? 'bg-secondary font-bold text-white'
                                                : 'text-black'
                                            } font-medium hover:bg-secondary hover:font-bold hover:text-white active:bg-secondary data-[active=true]:bg-secondary data-[state=open]:hover:bg-secondary dark:hover:bg-gray-800`}
                                            onClick={() =>
                                              redirect({
                                                module: module,
                                                form: form,
                                                filter: {
                                                  type: 'staticFilter',
                                                  name: 'All Records'
                                                }
                                              })
                                            }
                                          >
                                            <span className="flex items-center space-x-2">
                                              <Avatar className="h-5 w-5 bg-secondary">
                                                <AvatarImage
                                                  src={
                                                    form?.logo &&
                                                    `${process.env.REACT_APP_STORAGE_URL}/${form?.logo}`
                                                  }
                                                />
                                                <AvatarFallback className="bg-secondary text-xs font-semibold text-white dark:text-slate-800">
                                                  {form?.displayName &&
                                                  typeof form.displayName ===
                                                    'string'
                                                    ? form.displayName[0]?.toUpperCase()
                                                    : ''}
                                                </AvatarFallback>
                                              </Avatar>
                                              <span>{form.displayName}</span>
                                            </span>
                                          </SidebarMenuButton>
                                        </TooltipTrigger>
                                      </Tooltip>

                                      {form.filters?.length ? (
                                        <>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <CollapsibleTrigger
                                                asChild
                                                className="bg-transparent hover:bg-accent hover:text-black"
                                              >
                                                <SidebarMenuAction className="data-[state=open]:rotate-90">
                                                  <ChevronRight />
                                                  <span className="sr-only">
                                                    Toggle
                                                  </span>
                                                </SidebarMenuAction>
                                              </CollapsibleTrigger>
                                            </TooltipTrigger>
                                          </Tooltip>

                                          <CollapsibleContent>
                                            <SidebarMenuSub className="cursor-pointer">
                                              {form.filters?.map((filter) => (
                                                <SidebarMenuSubItem
                                                  key={filter.name}
                                                >
                                                  <SidebarMenuSubButton
                                                    asChild
                                                    onClick={() =>
                                                      redirect({
                                                        module: module,
                                                        form: form,
                                                        filter: filter
                                                      })
                                                    }
                                                    className="rounded p-2 text-black transition-all duration-300 hover:bg-secondary hover:text-white active:bg-secondary data-[active=true]:bg-secondary data-[state=open]:hover:bg-secondary"
                                                  >
                                                    <span className="flex gap-x-2">
                                                      {filter?.type ===
                                                      'staticFilter' ? (
                                                        <SquarePlus size={16} />
                                                      ) : (
                                                        <Filter size={16} />
                                                      )}

                                                      <span className="font-normal">
                                                        {filter.name}
                                                      </span>
                                                    </span>
                                                  </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                              ))}
                                            </SidebarMenuSub>
                                          </CollapsibleContent>
                                        </>
                                      ) : null}
                                    </SidebarMenuItem>
                                  </Collapsible>
                                ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </>
                      ) : null}
                    </SidebarMenuItem>
                  </Collapsible>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          </Collapsible>

          {currentUser?.role?.level == 1 && (
            <>
              {/* Dashboard Section */}
              {currentModule && (
                <Collapsible defaultOpen>
                  <SidebarGroup>
                    <SidebarMenu>
                      <Collapsible
                        key={'dashboard'}
                        asChild
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <SidebarGroupLabel className="mb-2 bg-transparent p-0 text-lg font-semibold tracking-normal text-black hover:bg-transparent dark:text-white">
                            <CollapsibleTrigger
                              asChild
                              className="bg-transparent hover:bg-transparent"
                            >
                              <SidebarMenuButton
                                tooltip={'Dashboard'}
                                className="bg-transparent p-4 hover:bg-accent hover:text-black active:bg-transparent data-[active=true]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:hover:text-black"
                              >
                                <span className="text-lg font-semibold tracking-normal text-black dark:text-white">
                                  {currentUser?.localizationJson['dashboard']}
                                </span>
                                <ChevronRight className="ml-auto transition-transform duration-100 group-data-[state=open]/collapsible:rotate-90" />
                              </SidebarMenuButton>
                            </CollapsibleTrigger>
                          </SidebarGroupLabel>
                          <CollapsibleContent>
                            <SidebarGroupContent>
                              <SidebarMenu>
                                {dashboardItems(currentModule).map((item) => (
                                  <SidebarMenuItem
                                    key={item.id}
                                    className="space-y-1"
                                  >
                                    <SidebarMenuButton
                                      asChild
                                      tooltip={item.name}
                                      className="text-black"
                                    >
                                      <Button
                                        variant={'ghost'}
                                        className={`w-full justify-start px-4 py-2 hover:font-bold dark:text-white ${location.pathname.includes(item.path) ? 'bg-secondary font-bold text-white hover:text-white' : 'font-medium hover:text-white'} hover:bg-secondary active:bg-secondary data-[active=true]:bg-secondary data-[state=open]:hover:bg-secondary`}
                                        onClick={() => navigate(item.path)}
                                      >
                                        <item.icon className="mr-2 h-4 w-4" />
                                        <span className="">{item.name}</span>
                                      </Button>
                                    </SidebarMenuButton>
                                  </SidebarMenuItem>
                                ))}
                              </SidebarMenu>
                            </SidebarGroupContent>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    </SidebarMenu>
                  </SidebarGroup>
                </Collapsible>
              )}
            </>
          )}
          {/* Admin Section */}
          {currentUser?.role?.level == 1 && (
            <Collapsible defaultOpen={true}>
              <SidebarGroup>
                <SidebarMenu>
                  <Collapsible
                    key={'admin'}
                    asChild
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <SidebarGroupLabel className="mb-2 bg-transparent p-0 text-lg font-semibold tracking-normal text-black hover:bg-transparent dark:text-white">
                        <CollapsibleTrigger
                          asChild
                          className="bg-transparent hover:bg-transparent"
                        >
                          <SidebarMenuButton
                            tooltip={'Admin'}
                            className="bg-transparent p-4 hover:bg-accent hover:text-black active:bg-transparent data-[active=true]:bg-transparent data-[state=open]:hover:bg-transparent data-[state=open]:hover:text-black"
                          >
                            <span className="text-lg font-semibold tracking-normal text-black dark:text-white">
                              Admin
                            </span>
                            <ChevronRight className="ml-auto transition-transform duration-100 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>
                      <CollapsibleContent>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            {adminItems
                              ?.filter((i) => i.condition)
                              .map((item) => (
                                <SidebarMenuItem
                                  key={item.name}
                                  className="space-y-1"
                                >
                                  <SidebarMenuButton
                                    asChild
                                    tooltip={item.name}
                                    className="text-black"
                                  >
                                    <Button
                                      variant="ghost"
                                      className={`w-full justify-start px-4 py-2 hover:bg-secondary hover:font-bold dark:text-white ${
                                        location.pathname.includes(item.path)
                                          ? 'bg-secondary font-bold text-white hover:text-white'
                                          : 'font-medium hover:text-white'
                                      } active:bg-secondary data-[active=true]:bg-secondary data-[state=open]:hover:bg-secondary`}
                                      onClick={() => navigate(item.path)}
                                    >
                                      <item.icon className="mr-2 h-4 w-4" />
                                      <span>{item.name}</span>
                                    </Button>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              ))}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroup>
            </Collapsible>
          )}
        </SidebarContent>
        <SidebarFooter>
          {isMobile && <NavUser user={user} />}
          {open && (
            <SidebarMenu>
              <SidebarMenuItem>
                <Link to={'/articles'}>
                  <Button
                    className="min-h-9 w-full justify-start"
                    variant="outline"
                  >
                    <div className="flex items-center gap-x-4">
                      <Newspaper size={16} strokeWidth={2} className="" />
                      <span className="text-base font-semibold">Articles</span>
                    </div>
                  </Button>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarFooter>
      </Sidebar>
      {isMobile && (
        <SidebarTrigger
          className={`absolute z-50 mx-2 my-3 p-4 ${isMobile ? 'left-0 bg-accent' : open ? 'left-64' : 'left-12'} top-1`}
        />
      )}
    </div>
  );
}

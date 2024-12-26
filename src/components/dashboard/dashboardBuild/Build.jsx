import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { colors } from '../../../common/constants/styles';

import {
  deleteDashboard,
  fetchDashboardsByModuleInfoId
} from '../../../redux/slices/dashboardSlice';
import './Build.css';

import { Button } from '@/componentss/ui/button';
import DashboardPreview from '../DashboardPreview';
import { fetchDashboardByDashboardInfoId } from '../../../services/chart';
import {
  MoreHorizontal,
  Pencil,
  Plus,
  ScanEye,
  SlidersHorizontal,
  SquareArrowOutUpRight,
  Trash2
} from 'lucide-react';
import NoDashboard from '@/assets/nodashboard.svg';
import { Separator } from '@/componentss/ui/separator';
import { Card, CardContent, CardFooter } from '@/componentss/ui/card';
import { Modal } from '@/componentss/ui/modal';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger
} from '@/componentss/ui/menubar';
import ConfirmationModal from '../../shared/ConfirmationModal';

const Build = () => {
  const { currentModule } = useSelector((state) => state.current);
  const { currentTheme } = useSelector((state) => state.auth);
  const { dashboards } = useSelector((state) => state.dashboard);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [currentDashboard, setCurrentDashboard] = useState(null);
  const [dashboardData, setDashboardData] = useState();
  const [prevLoading, setPrevLoading] = useState(true);
  const [chartDatas, setChartDatas] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const gridSpacing = 3;
  const cardStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: currentTheme === 'Dark' ? colors.darkTab : colors.white,
    border: `1px solid ${colors.grey[100]} `,
    boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
    borderRadius: '25px',
    minWidth: '330px',
    padding: '12px',
    minHeight: '200px',
    transition: 'transform 0.3s ease, border-color 0.3s ease',
    '&:hover': {
      transform: 'scale(1.02)'
    }

    // borderColor: '#eef2f6'
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event, dashboard) => {
    setAnchorEl(event?.currentTarget);
    setCurrentDashboard(dashboard);
    setChartDatas(null);
    setPrevLoading(true);
    setPreviewDialog(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setCurrentDashboard(null);
    setChartDatas(null);
    setPrevLoading(true);
    setPreviewDialog(false);
  };
  useEffect(() => {
    if (currentModule && currentModule?.moduleInfoId) {
      dispatch(
        fetchDashboardsByModuleInfoId({
          moduleInfoId: currentModule?.moduleInfoId
        })
      );
    }
  }, [currentModule, dispatch]);
  // useEffect(() => {
  //   dispatch(
  //     fetchDashboardByDashboardInfoId({
  //       dashboardInfoId: selectedDashboardObj.dashboardInfoId
  //     })
  //   ).then((response) => {
  //     setDashboardData(response.payload);
  //   });
  // });
  useEffect(() => {
    if (currentDashboard && previewDialog) {
      setTimeout(() => {
        handleDashboardChange(currentDashboard?.displayName);
      }, 500);
    }
  }, [currentDashboard, previewDialog]);

  const handleAddDashboardClick = () => {
    navigate(`/app/${currentModule?.name}/dashboard/create`);
  };

  const handleEditDashboard = (dashboardInfoId) => {
    navigate(
      `/app/${currentModule?.name}/dashboard/create?selectedId=${dashboardInfoId}`
    );
  };

  const handleDeleteDashboard = async (dashboardId) => {
    await dispatch(deleteDashboard({ dashboardInfoId: dashboardId }));
    dispatch(
      fetchDashboardsByModuleInfoId({
        moduleInfoId: currentModule?.moduleInfoId
      })
    );
    handleClose();
  };

  // const columns = [
  //   { field: 'serialNumber', headerName: 'No.', width: 70 },

  //   { field: 'displayName', headerName: 'Dashboard Name', flex: 1 },
  //   {
  //     field: 'actions',
  //     headerName: 'Actions',
  //     flex: 1,
  //     sortable: false,
  //     renderCell: (params) => (
  //       <>
  //         <IconButton
  //           aria-label="edit"
  //           onClick={() => handleEditDashboard(params.row.dashboardInfoId)}
  //           style={{ color: COLORS.PRIMARY }}
  //         >
  //           <EditIcon />
  //         </IconButton>
  //         <IconButton
  //           aria-label="delete"
  //           onClick={() => handleDeleteDashboard(params.row.dashboardInfoId)}
  //           style={{ color: 'red' }}
  //         >
  //           <DeleteIcon />
  //         </IconButton>
  //       </>
  //     )
  //   }
  // ];
  const truncateStringByWordCount = (input, count) => {
    if (input) {
      const words = input.split(/\s+/);
      return (
        words.slice(0, count).join(' ') + (words.length > count ? '...' : '')
      );
    }
    return '';
  };

  const handleDashboardChange = (selectedDisplayName) => {
    // const canvasContainer = document.getElementById('canvasContainer');
    // if (canvasContainer) {
    //   canvasContainer.innerHTML = '';

    // setDashboardData();
    const selectedDashboardObj = dashboards.find(
      (dashboard) => dashboard.displayName === selectedDisplayName
    );

    if (selectedDashboardObj) {
      fetchDashboardByDashboardInfoId({
        dashboardInfoId: selectedDashboardObj.dashboardInfoId,
        data: {
          range: null
        }
      })
        .then((response) => {
          setDashboardData(response);
          const items = JSON.parse(JSON.stringify(response.items));

          // getChartData(items, setPrevLoading, setChartDatas, true);
          setChartDatas(items);
          setPrevLoading(false);
          return;
        })
        .catch((error) => {
          console.error('Dashboard API Error:', error);
        });
    }
    // }
  };
  function capitalizeWords(str) {
    if (!str) {
      return '';
    }

    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
      .join(' ');
  }
  const color = ['#2196F3', '#673AB7', '#00C853', '#FFC107'];

  const getColorByIndex = (index) => {
    return color[index % color.length];
  };
  function capitalizeFirstWord(sentence) {
    if (!sentence) return sentence;
    let words = sentence.split(' ');
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ');
  }
  return (
    <div className="h-screen rounded-md bg-background p-2">
      {dashboards.length > 0 ? (
        <>
          <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between p-3">
              <span className="text-lg font-bold">Build Dashboard</span>
              <Button onClick={handleAddDashboardClick} className="font-bold">
                <Plus className="mr-2 h-4 w-4" /> Build New
              </Button>
            </div>
            <Separator className="mb-4 h-1" />
            <div className="flex flex-wrap gap-x-4 px-4">
              {dashboards.map((item) => (
                <Card
                  key={item.displayName}
                  className="relative flex flex-col justify-between"
                  style={cardStyle}
                >
                  <div className="absolute left-[2%] top-[6%] z-0 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-secondary"></div>
                  <div className="absolute left-[22%] top-[-4%] h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-secondary opacity-70"></div>

                  <CardContent className="relative z-10 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-white">
                        {capitalizeFirstWord(
                          truncateStringByWordCount(item?.displayName, 2)
                        )}
                      </h3>
                      <Menubar>
                        <MenubarMenu className="border-none bg-white">
                          <MenubarTrigger className="cursor-pointer bg-white focus:bg-white focus:text-black data-[state=close]:bg-white data-[state=open]:bg-white data-[state=open]:text-black">
                            <MoreHorizontal className="h-5 w-5" />
                          </MenubarTrigger>
                          <MenubarContent className="min-w-20 cursor-pointer">
                            <MenubarItem
                              onClick={() =>
                                handleEditDashboard(item?.dashboardInfoId)
                              }
                              className="flex items-center gap-x-2 text-secondary hover:bg-secondary hover:text-white"
                            >
                              {console.log(item, 'item')}
                              <Pencil size={16} className="" /> Edit
                            </MenubarItem>
                            <MenubarItem
                              onClick={() => {
                                setDeleteDialog(true);
                                setCurrentDashboard(item);
                              }}
                              className="flex items-center gap-x-2 text-secondary hover:bg-secondary hover:text-white"
                            >
                              <Trash2 size={16} className="" /> Delete
                            </MenubarItem>
                            <MenubarItem
                              onClick={() => {
                                setPreviewDialog(true);
                                setCurrentDashboard(item);
                              }}
                              className="flex items-center gap-x-2 text-secondary hover:bg-secondary hover:text-white"
                            >
                              <ScanEye size={16} className="" /> Preview
                            </MenubarItem>
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>
                  </CardContent>
                  <CardFooter className="flex items-center justify-start p-4">
                    <div className="flex items-center gap-x-3">
                      <SlidersHorizontal size={18} className="text-secondary" />
                      <span className="font-semibold text-secondary">
                        {item.totalConfigs} configs
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          {console.log(currentDashboard)}

          {deleteDialog && (
            <ConfirmationModal
              open={deleteDialog}
              heading={`Delete dashboard`}
              message={`Are you sure you want to delete ${currentDashboard?.displayName} ?`}
              onConfirm={() => {
                handleDeleteDashboard(currentDashboard.dashboardInfoId);
                handleClose();
              }}
              onCancel={() => setDeleteDialog(false)}
              firstButtonText="cancel"
              secondButtonText="Confirm"
            />
          )}

          <div className="relative flex w-full flex-wrap sm:w-1/2 md:w-1/3">
            {previewDialog && (
              <Modal
                isOpen={previewDialog}
                onClose={() => setPreviewDialog(false)}
                title={`Preview ${currentDashboard?.displayName}`}
                description="This is dasboard preview"
                width={'75rem'}
                className="overflow-hidden"
              >
                <>
                  {!prevLoading ? (
                    <>
                      <div class="flex w-full flex-col items-center">
                        <div class="flex w-full flex-wrap items-center justify-between gap-2">
                          <DashboardPreview
                            data={dashboardData}
                            chartData={chartDatas}
                            chartComponent={
                              <div
                                className="mt-8 flex flex-wrap items-center justify-center"
                                style={{ gap: '10px' }}
                              ></div>
                            }
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div
                      className="flex items-center justify-center"
                      style={{ height: '80vh' }}
                    >
                      <div className="flex items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-400 border-t-transparent"></div>
                      </div>
                    </div>
                  )}
                </>
              </Modal>
            )}
          </div>
        </>
      ) : (
        <div className="flex h-[calc(100vh-130px)] w-full items-center justify-center">
          <div className="flex flex-col items-center">
            <img src={NoDashboard} alt="no dashboard" className="h-56" />
            <div className="flex gap-x-1 py-2 text-sm font-normal text-black">
              No dashboards build is configured! please
              <span
                className="flex cursor-pointer items-center gap-x-1 font-medium text-primary underline underline-offset-2 hover:text-primary"
                onClick={handleAddDashboardClick}
              >
                {' '}
                create new{' '}
                <span>
                  <SquareArrowOutUpRight size={14} />
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Build;

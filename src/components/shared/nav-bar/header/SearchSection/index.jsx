/* eslint-disable no-lone-blocks */
import { Avatar, AvatarImage } from '@/componentss/ui/avatar';

import { Separator } from '@/componentss/ui/separator';

import { IconLogout } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../../../../common/constants/styles';
import { toSnakeCase } from '../../../../../common/utils/helpers';
import { debounce } from 'lodash';
import { Label } from '@/componentss/ui/label';
import {
  fetchModuleById,
  fetchModuleByName
} from '../../../../../services/module';
import { useRef } from 'react';
import Transitions from '../../../../../elements/Transitions';
import { fetchRecordsBytableName } from '../../../../../services/table';
import { fetchFormByName } from '../../../../../services/form';
import { Input } from '@/componentss/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/componentss/ui/popover';
import { Search, SquareArrowRight } from 'lucide-react';

const TENANT_ID = 'mahb1';

function SeachSection() {
  const [filterPopUp, setFilterPopUp] = useState({
    open: false,
    columnKey: null,

    position: { top: '-16', left: '-598px' }
  });
  const navigate = useNavigate();
  // const [isClicked, setIsClicked] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [searchVal, setSearchVal] = useState('');
  const { currentTheme } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const [recordData, setRecordData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const anchorRef = useRef(null);
  const [tableList, setTableList] = useState([]);
  const [clickedChips, setClickedChips] = useState([]);
  const uuidRegex =
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;

  useEffect(() => {
    const initialClickedChips = new Array(tableList.length + 1).fill(false);
    initialClickedChips[0] = true;
    setClickedChips(initialClickedChips);
  }, [tableList]);

  const handleChipClick = (index) => {
    const updatedClickedChips = new Array(clickedChips.length).fill(false);
    updatedClickedChips[index] = true; // Set the clicked chip to true
    setClickedChips(updatedClickedChips);
  };

  const searchValue = (val) => {
    setSearch(val);
  };

  const handleToggle = async () => {
    setFilterPopUp((prev) => ({
      ...prev,
      open: true
    }));
    const data = await fetchRecordsBytableName('open_search_config');
    setTableList(data.data);
  };

  // const prevOpen = useRef(filterPopUp.open);
  // useEffect(() => {
  //   if (prevOpen.current === true && filterPopUp.open === false) {
  //     anchorRef.current.focus();
  //   }

  //   prevOpen.current = filterPopUp.open;
  // }, [filterPopUp.open]);

  const fetchData = async (value) => {
    const controller = new AbortController();
    try {
      const response = await fetch('https://devml.dglide.com/search', {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'X-TenantID': TENANT_ID,
          'api-key':
            '27260e675a5924d01c57bcfb3140c15cbcb529a13370e97e6a5d64b0770a0aff'
        },
        body: JSON.stringify({ query: value }),
        signal: controller.signal
      });
      const responseJson = await response.json();
      setRecordData(responseJson);
      setError(null);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Error fetching data');
      }
    } finally {
      setLoading(false);
    }
    return () => {
      controller.abort();
    };
  };
  useEffect(() => {
    if (search) {
      const debouncedFetch = debounce(async () => {
        if (search) {
          const value = toSnakeCase(search);
          setSearchVal(value);
          setLoading(true);
          fetchData(value);
        }
      }, 800);

      debouncedFetch();
      return () => {
        debouncedFetch.cancel();
      };
    } else {
      setRecordData({});
      // setRecordData((prev)=>({
      //   ...prev,
      //   hits:[]
      // }));
    }
  }, [search]);

  const handleClose = (event) => {
    setFilterPopUp((prev) => ({
      ...prev,
      open: false
    }));
  };

  const groupedData = recordData?.hits?.reduce((acc, item) => {
    const tableName =
      item._index === TENANT_ID
        ? null
        : item._index.replace(`${TENANT_ID}_`, '');
    if (tableName) {
      if (!acc[tableName]) acc[tableName] = [];
      acc[tableName].push(item);
    }
    return acc;
  }, {});

  const handleEditRecord = async (tabelName, uuid) => {
    fetchFormByName(tabelName).then((res) => {
      if (res?.result) {
        const moduleName = res?.result?.moduleName;
        if (moduleName) {
          navigate(`/app/${moduleName}/${tabelName}/modify?id=${uuid}`);
        }
      }
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchVal) {
      navigate('/globleSearch', {
        state: {
          searchVal: searchVal,
          tableName: 'All'
        }
      });
    }
  };

  return (
    <>
      <div>
        <Popover
          open={filterPopUp.open}
          onOpenChange={() =>
            setFilterPopUp((prev) => ({ ...prev, open: !filterPopUp.open }))
          }
        >
          <PopoverTrigger
            asChild
            className="absolute"
            style={{
              top: filterPopUp.position.top,
              left: filterPopUp.position.left,
              zIndex: 1300
            }}
          >
            <Input
              type="text"
              id="search"
              placeholder="Search"
              value={search || ''}
              onChange={(e) => searchValue(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              onBlur={() =>
                setFilterPopUp((prev) => ({ ...prev, open: false }))
              }
              ref={anchorRef}
              onFocus={handleToggle}
              className="w-full bg-background text-black sm:w-[300px] md:w-[400px] lg:w-[600px]"
              startIcon={<Search size={16} />}
            />
          </PopoverTrigger>
          <PopoverContent
            className={`max-h-[30vh] min-h-fit border-none bg-white shadow-none lg:w-[600px] top-${filterPopUp.position.top} left-${filterPopUp.position.left} z-[1300]`}
          >
            <div className="min-h-fit w-full">
              <div className="px-3 py-1">
                <div className="flex items-center justify-between space-x-6">
                  <div className="flex flex-col items-center">
                    <div className="mb-2 flex w-full justify-between">
                      <div className="">
                        <span
                          className={`mr-2 rounded-xl px-2 py-1 text-sm ${clickedChips[0] ? 'bg-primary text-white' : 'text-initial bg-[#e1b7a4]'} cursor-pointer hover:shadow-none`}
                          onClick={() => {
                            handleChipClick(0);
                            setSelectedTable('');
                          }}
                        >
                          All
                        </span>

                        {tableList &&
                          tableList.map((item, i) => (
                            <span
                              className={`mr-2 cursor-pointer rounded-xl px-2 py-1 text-sm ${clickedChips[i + 1] ? 'bg-primary text-white' : 'text-initial bg-[#f9dccf]'} hover:shadow-none`}
                              onClick={() => {
                                handleChipClick(i + 1);
                                setSelectedTable(item.table_name);
                              }}
                            >
                              {item.table_name.charAt(0).toUpperCase() +
                                item.table_name.slice(1)}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator className="mb-4 h-1" />
              <div style={{ py: 2 }}>
                <div>
                  <div
                    className={`overflow-y-scroll ${recordData.hits?.length > 0 ? 'h-[50vh]' : 'h-auto'}`}
                  >
                    <div className="my-2">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center">
                          <div className="mx-auto flex min-w-full max-w-screen-lg items-center justify-center">
                            <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
                          </div>
                        </div>
                      ) : error ? (
                        <div className="flex flex-col items-center justify-center">
                          <Label>No data found</Label>
                        </div>
                      ) : recordData.hits?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center">
                          <Label>No data found</Label>
                        </div>
                      ) : Object.keys(recordData).length === 0 ? (
                        <div className="my-5"></div>
                      ) : (
                        groupedData &&
                        Object.keys(groupedData)
                          .filter(
                            (tableName) =>
                              selectedTable === '' ||
                              tableName === selectedTable
                          )
                          .map((tableName, index) => (
                            <div
                              className={`mb-3 p-4 shadow-md ${
                                currentTheme === 'Dark'
                                  ? 'bg-dark-level-1'
                                  : 'bg-slate-100'
                              } min-h-[135px] cursor-pointer rounded-lg transition-transform hover:outline hover:outline-1 hover:outline-secondary`}
                              key={index}
                            >
                              <div className="flex justify-between">
                                <Label className="text-sm font-semibold">
                                  {tableName.charAt(0).toUpperCase() +
                                    tableName.slice(1)}
                                </Label>
                                <Label
                                  className="text-sm font-normal"
                                  onClick={() => {
                                    setOpen(false);
                                    navigate('/globleSearch', {
                                      state: {
                                        searchVal: searchVal,
                                        tableName: tableName
                                      }
                                    });
                                  }}
                                >
                                  View All
                                </Label>
                              </div>
                              {groupedData[tableName]
                                .slice(0, 3)
                                .map((filteredData, subIndex) => (
                                  <div
                                    key={subIndex}
                                    className="mb-2 ms-2 mt-2 flex items-center gap-2"
                                    onClick={() =>
                                      handleEditRecord(
                                        tableName,
                                        filteredData._source.uuid
                                      )
                                    }
                                  >
                                    {Object.keys(filteredData._source)
                                      .filter(
                                        (key) =>
                                          !uuidRegex.test(
                                            filteredData._source[key]
                                          )
                                      )
                                      .slice(0, 1)
                                      .map((key, index) => (
                                        <>
                                          <span
                                            className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-light`}
                                          >
                                            <SquareArrowRight />
                                          </span>
                                          <span>
                                            {filteredData._source[key]}
                                          </span>
                                        </>
                                      ))}
                                  </div>
                                ))}
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export default SeachSection;

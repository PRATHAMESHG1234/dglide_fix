import { Card, Grid, ListItemIcon } from '@mui/material';
import React from 'react';
import { colors } from '../../../common/constants/styles';
import { useSelector } from 'react-redux';
import { fetchFormByName } from '../../../services/form';
import { fetchModuleById } from '../../../services/module';
import { useNavigate } from 'react-router-dom';
import { Chip } from '@mui/joy';
import { SquareArrowRight } from 'lucide-react';
import { Label } from '@/componentss/ui/label';

export const GlobalSearchCard = ({ searchData }) => {
  const uuidRegex =
    /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/;
  const TENANT_ID = 'mahb1';
  const navigate = useNavigate();

  const handleEditRecord = async (index, uuid) => {
    const tableName =
      index === TENANT_ID ? null : index.replace(`${TENANT_ID}_`, '');
    fetchFormByName(tableName).then((res) => {
      if (res?.result) {
        const moduleName = res?.result?.moduleName;
        if (moduleName) {
          navigate(`/app/${moduleName}/${tableName}/modify?id=${uuid}`);
        }
      }
    });
  };
  const { currentTheme } = useSelector((state) => state.auth);
  return (
    <div style={{ overflowY: 'auto', maxHeight: '78vh', marginLeft: '20px' }}>
      <Grid>
        <Grid container justifyContent="space-between">
          <Grid item sx={{ width: '50%' }}>
            <div className="">
              {searchData &&
                searchData.map((filteredData, subIndex) => {
                  const tableName =
                    filteredData._index === TENANT_ID
                      ? null
                      : filteredData._index.replace(`${TENANT_ID}_`, '');
                  return (
                    <div
                      key={filteredData._id}
                      className={`mb-3 p-4 shadow-md ${
                        currentTheme === 'Dark' ? 'bg-dark-level-1' : 'bg-white'
                      } min-h-[109px] cursor-pointer rounded-lg transition-transform hover:outline hover:outline-1 hover:outline-secondary`}
                      onClick={() =>
                        handleEditRecord(
                          filteredData._index,
                          filteredData._source.uuid
                        )
                      }
                    >
                      <div className="flex items-center gap-2">
                        <div className="mx-2">
                          <span
                            className={`flex h-16 w-16 items-center justify-center rounded-xl bg-[#f6e1d7] text-sm font-light`}
                          >
                            <SquareArrowRight />
                          </span>
                        </div>
                        <div className="">
                          {Object.keys(filteredData._source)
                            .filter(
                              (key) =>
                                !uuidRegex.test(filteredData._source[key])
                            )
                            .map((key, index) => (
                              <div
                                key={index}
                                className="flex"
                                style={{ display: 'flex', gap: '4px' }}
                              >
                                <Label
                                  className={` ${index === 0 ? 'text-[15px] font-semibold' : ''} ${index === 1 ? 'text-[12px] font-normal' : ''} ${index > 1 ? 'font-inherit text-[12px]' : ''} `}
                                >
                                  {filteredData._source[key]}
                                </Label>
                              </div>
                            ))}
                          <span className="text-initial mr-2 cursor-pointer rounded-xl bg-[#f9dccf] px-4 py-1 text-sm hover:shadow">
                            {tableName}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

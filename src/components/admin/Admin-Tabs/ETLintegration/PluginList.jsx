import { useSelector } from 'react-redux';

import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';
import { Label } from '@/componentss/ui/label';

import { colors } from '../../../../common/constants/styles';

export const PluginList = ({
  allPluginList,
  pluginTypeList,
  setpluginEdit
}) => {
  const { currentTheme } = useSelector((state) => state.auth);
  const color = [colors.primary.main];

  function assignColorById(id) {
    const colorIndex = id % color.length;
    const assignedColor = color[colorIndex];

    return assignedColor;
  }
  return (
    <div className="flex flex-wrap p-3">
      {allPluginList &&
        allPluginList.map((plugin, index) => (
          <div>
            <div
              className={`mb-3 mr-3 h-[135px] w-[210px] p-4 ${currentTheme === 'Dark' ? 'bg-darkLevel1' : 'bg-white'} rounded-lg border ${currentTheme === 'Dark' ? 'border-transparent' : 'border-gray-100'} hover:border-primary-main flex cursor-pointer flex-col items-center justify-center shadow-md`}
              onClick={() => {
                setpluginEdit({ type: 'edit', data: plugin });
              }}
            >
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={plugin?.logoUrl} />
                  <AvatarFallback className="text-2xl">
                    {plugin.name?.trim().charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <Label className="mt-2 text-start font-medium">
                  {plugin.name}
                </Label>
                {/* <div className="flex  items-center ">
                  <Typography sx={{ color: '#383A41', fontSize: '12px' }}>
                    {pluginTypeList.find((o) => o.value === plugin.type)?.label}
                  </Typography>
                  <span>
                    {plugin.isConfigured === true ? (
                      <CheckCircleIcon
                        sx={{
                          color: colors.success.main,
                          width: 16,
                          height: 16,
                          marginLeft: 0.5
                        }}
                      />
                    ) : (
                      <CancelIcon
                        sx={{
                          color: colors.error.main,
                          width: 16,
                          height: 16,
                          marginLeft: 0.5
                        }}
                      />
                    )}
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

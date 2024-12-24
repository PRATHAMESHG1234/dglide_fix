import { Divider, Typography } from '@mui/joy';
import { CardActionArea } from '@mui/material';

import { CATELOG_FIELDS, catalogType } from '../../../common/utils/fields';
import Icon from '../../../elements/Icon';
import { colors, COLORS } from '../../../common/constants/styles';

const Selector = ({ onFieldAdded, type }) => {
  return (
    <>
      <Typography level="title-sm" paddingY="10px" paddingX="8px">
        Form Fields
      </Typography>
      <Divider />
      <div
        className="flex flex-wrap"
        style={{
          maxHeight: 'calc(100vh - 250px)',
          overflowY: 'scroll'
        }}
      >
        {type === 'Document Type'
          ? CATELOG_FIELDS?.map((field) => {
              if (field.category === 'TextArea') {
                return (
                  <CardActionArea
                    key={field.category}
                    className="flex flex-col items-center justify-center p-2 shadow-sm"
                    onClick={() => onFieldAdded(field)}
                    sx={{
                      height: '110px',
                      width: '110px',
                      backgroundColor: 'rgb(255, 255, 255)',
                      margin: '5px',
                      borderRadius: '5px'
                    }}
                  >
                    <Icon name={field.category} fontSize="30px" />
                    <Typography
                      level="body-xs"
                      sx={{ mt: 0.2, color: COLORS.SECONDARY }}
                    >
                      {field.label}
                    </Typography>
                  </CardActionArea>
                );
              }
            })
          : CATELOG_FIELDS?.map((field) => {
              if (
                field.category !== 'Json' &&
                field.category !== 'AutoIncrement'
              ) {
                return (
                  <CardActionArea
                    key={field.category}
                    className="flex flex-col items-center justify-center p-2 shadow-sm"
                    onClick={() => onFieldAdded(field)}
                    sx={{
                      height: '110px',
                      width: '110px',
                      backgroundColor: 'rgb(255, 255, 255)',
                      margin: '5px',
                      borderRadius: '5px'
                    }}
                  >
                    <Icon name={field.category} fontSize="30px" />
                    <Typography
                      level="body-xs"
                      sx={{ mt: 0.2, color: COLORS.SECONDARY }}
                    >
                      {field.label}
                    </Typography>
                  </CardActionArea>
                );
              }
            })}
      </div>
    </>
  );
};

export default Selector;

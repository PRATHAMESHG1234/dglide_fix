import { FIELDS } from '../../common/utils/fields';
import Icon from '../../elements/Icon';
import { colors } from '../../common/constants/styles';
import { useSelector } from 'react-redux';
import { Label } from '@/componentss/ui/label';

const Selector = ({ onFieldAdded }) => {
  const { currentTheme } = useSelector((state) => state.auth);

  return (
    <>
      <div className="py-1 ps-2">
        <Label className="text-sm font-semibold">Form Fields</Label>
      </div>
      <hr />
      <div
        className="flex flex-wrap"
        style={{
          maxHeight: 'calc(100vh - 235px)',
          overflowY: 'auto'
        }}
      >
        {FIELDS?.map((field) => (
          <div
            key={field.category}
            className="flex cursor-pointer flex-col items-center justify-center p-2 shadow-sm"
            onClick={() => onFieldAdded(field)}
            style={{
              height: '110px',
              width: '110px',
              backgroundColor:
                currentTheme === 'Dark' ? colors.darkTab : colors.white,
              boxShadow:
                currentTheme === 'Light' &&
                'rgba(149, 157, 165, 0.2) 0px 8px 24px',
              border: `solid 1px ${colors.grey[200]}`,
              margin: '5px',
              transition: '0.2s transform',
              borderRadius: '5px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = 'scale(1.05)')
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Icon name={field.category} size={25} />
            <Label className="text-xs">{field.label}</Label>
          </div>
        ))}
      </div>
    </>
  );
};

export default Selector;

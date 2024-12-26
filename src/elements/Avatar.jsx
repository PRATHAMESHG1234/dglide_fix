import { alpha } from '@mui/material';
import MuiAvatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';

const colorMap = [
  { A: '#AB0CFF' },
  { B: '#3283FF' },
  { C: '#85660C' },
  { D: '#7729B6' },
  { E: '#565656' },
  { F: '#1C8356' },
  { G: '#10D127' },
  { H: '#FFC100' },
  { I: '#999999' },
  { J: '#007F27' },
  { K: '#C5441C' },
  { L: '#D073FF' },
  { M: '#C5441C' },
  { N: '#D073FF' },
  { O: '#FD00F9' },
  { P: '#325A9B' },
  { Q: '#FEAE16' },
  { R: '#FC6F99' },
  { S: '#91AD1C' },
  { T: '#F5212D' },
  { U: '#05be96' },
  { V: '#0E91AF' },
  { W: '#B10CA1' },
  { X: '#BF73A5' },
  { Y: '#FE1CBF' },
  { Z: '#B10068' }
];

const Avatar = (props) => {
  const { currentTheme } = useSelector((state) => state.auth);

  const findColor = (id) => {
    if (!id) return;
    const color = colorMap.find((clr) => clr[id]);
    return color[id];
  };

  const initialCharacter = props.value?.charAt(0).toUpperCase();

  const selectedColor = findColor(initialCharacter);
  return (
    <div>
      <MuiAvatar
        style={{
          width: 40,
          height: 40,
          fontSize: '15px',
          fontWeight: 500,
          backgroundColor: selectedColor && alpha(selectedColor, 0.2),
          color: currentTheme === 'Light' ? selectedColor : 'white',
          ...props.sx
        }}
      >
        {initialCharacter}
      </MuiAvatar>
    </div>
  );
};
export default Avatar;

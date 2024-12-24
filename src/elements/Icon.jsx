import {
  FormInput,
  TextCursorInput,
  ArrowUpDown,
  Calendar,
  Key,
  CircleDot,
  Search,
  Table,
  Table2,
  Braces,
  SquareCheck,
  ChevronDown,
  Link2,
  Activity,
  ToggleLeft,
  Ban,
  BookType,
  Waypoints
} from 'lucide-react';

const Icon = ({ name, size = '16px', style = {}, className = '' }) => {
  const baseStyle = {
    color: 'rgba(76, 88, 106, 0.7)',
    margin: '10px',
    ...style
  };

  const iconProps = { style: baseStyle, className, size };

  switch (name) {
    case 'Input':
      return <FormInput {...iconProps} />;

    case 'Number':
      return <TextCursorInput {...iconProps} />;

    case 'TextArea':
      return <BookType {...iconProps} />;

    case 'AutoIncrement':
      return <ArrowUpDown {...iconProps} />;

    case 'Password':
      return <Key {...iconProps} />;

    case 'Date':
      return <Calendar {...iconProps} />;

    case 'DropDown':
      return <ChevronDown {...iconProps} />;

    case 'Radio':
      return <CircleDot {...iconProps} />;

    case 'Checkbox':
      return <SquareCheck {...iconProps} />;

    case 'Reference':
      return <Link2 {...iconProps} />;

    case 'Lookup':
      return <Search {...iconProps} />;

    case 'activity':
      return <Activity {...iconProps} />;

    case 'TableReference':
      return <Table2 {...iconProps} />;

    case 'TableLookup':
      return <Table {...iconProps} />;

    case 'Switch':
      return <ToggleLeft {...iconProps} />;

    case 'Json':
      return <Braces {...iconProps} />;

    case 'ModuleForm':
      return <Waypoints {...iconProps} />;

    default:
      return <Ban {...iconProps} />;
  }
};

export default Icon;

import { useSidebar } from '@/componentss/ui/sidebar';
import { Box, ChartSpline, CircleX, History, Store } from 'lucide-react';

interface UserCountCardProps {
  primary: string;
  secondary: string;
  showCrossIcon?: boolean;
  onCrossClick?: () => void;
  onClick?: () => void;
  index?: number;
}

// =============================|| USER NUM CARD ||============================= //

const UserCountCard: React.FC<UserCountCardProps> = ({
  primary = '',
  secondary = '',
  showCrossIcon = false,
  onCrossClick = () => {},
  onClick = () => {},
  index
}) => {
  const isLaptop = window.innerWidth >= 1024 && window.innerWidth <= 1440;
  const { open } = useSidebar();

  // Icon array
  const icons = [ChartSpline, History, Box, Store];
  // Color classes array
  const colors = [
    'text-chart-1',
    'text-chart-2',
    'text-chart-3',
    'text-chart-4',
    'text-chart-5'
  ];
  const bgColors = [
    'bg-chart-1/30',
    'bg-chart-2/30',
    'bg-chart-3/30',
    'bg-chart-4/30',
    'bg-chart-5/30'
  ];
  // Get icon and color based on index, using modulo to cycle through arrays
  const IconComponent = icons[index % icons?.length];
  const colorClass = colors[index % colors?.length];
  const bgColorClass = bgColors[index % bgColors?.length];

  return (
    <div
      className={`relative p-4 text-white ${isLaptop && open ? 'w-[23.5rem] max-w-[23.5rem]' : isLaptop && !open ? 'w-[28rem] max-w-[28rem]' : 'w-[25rem] max-w-[25rem]'}`}
      onClick={onClick}
    >
      {showCrossIcon && (
        <div className="absolute right-1 top-1">
          <div
            className="rounded-md bg-background p-1 text-destructive hover:bg-destructive hover:text-white"
            onClick={onCrossClick}
          >
            <CircleX size={18} className="cursor-pointer" />
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex flex-col items-start justify-start space-y-1">
          <div className="text-center text-3xl font-bold text-black">
            {secondary}
          </div>
          <div className="text-center text-base font-medium text-slate-500">
            {primary}
          </div>
        </div>
        <div className="flex items-center justify-end px-4">
          <div className={`rounded-2xl ${bgColorClass} p-3`}>
            {IconComponent && (
              <IconComponent className={`${colorClass}`} size={26} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCountCard;

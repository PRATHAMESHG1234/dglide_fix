import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

interface SideIconCardProps {
  iconPrimary: React.ReactNode;
  primary: string;
  secondary: string;
  secondarySub: string;
  color: string;
  bgcolor?: string;
  url?: string;
  setCurrentForm?: (formName: string) => void;
  formName: string;
  tab: string;
}

const SideIconCard: React.FC<SideIconCardProps> = ({
  iconPrimary,
  primary,
  secondary,
  secondarySub,
  color,
  bgcolor,
  url,
  setCurrentForm,
  formName,
  tab
}) => {
  const navigate = useNavigate();
  const IconPrimary = iconPrimary;

  const { currentTheme } = useSelector((state: any) => state.auth);

  const handleClick = () => {
    navigate(`/admin/${tab}/${formName}`);
  };

  return (
    <div
      className={`relative h-20 w-72 scale-90 transform cursor-pointer overflow-hidden rounded-lg shadow-lg transition-transform hover:scale-95`}
      style={{ backgroundColor: bgcolor || '' }}
      onClick={() => handleClick()}
    >
      <div
        className={`flex items-center justify-between`}
        style={{
          backgroundColor: currentTheme === 'Dark' ? '#1f2937' : 'white' // Replace with equivalent Tailwind colors
        }}
      >
        <div
          className="flex h-20 w-2/5 items-center justify-center bg-secondary px-0"
          // style={{ backgroundColor: color }}
        >
          <div className="text-center text-white">
            <span className="flex h-12 w-12 items-center justify-center">
              {IconPrimary}
            </span>
          </div>
        </div>
        <div className="flex w-3/5 flex-col justify-between space-y-2 px-2 py-2">
          <div>
            <p
              className={`line-clamp-1 text-lg font-semibold ${
                currentTheme === 'Dark' ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              {primary}
            </p>
          </div>
          <div>
            <p
              className={`line-clamp-1 text-sm font-normal ${
                currentTheme === 'Dark' ? 'text-gray-500' : 'text-gray-600'
              }`}
            >
              {secondary} <span style={{ color }}>{secondarySub}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideIconCard;

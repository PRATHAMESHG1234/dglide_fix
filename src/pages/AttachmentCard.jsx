import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

// assets
import { Download } from 'lucide-react';
import { colors } from '../common/constants/styles';
import { ArrowDownToLine } from 'lucide-react';

// ==============================|| ATTACHMENT CARD ||============================== //

const AttachmentCard = ({ title, link, fileType }) => {
  const theme = useTheme();
  const maxTitleLength = 15; // Adjust the max length as needed
  const truncatedTitle =
    title.length > maxTitleLength
      ? `${title.slice(0, maxTitleLength)}...`
      : title;
  const defaultImages = {
    pdf: 'https://cdn-icons-png.flaticon.com/512/337/337946.png',
    xlsx: 'https://cdn-icons-png.flaticon.com/512/8243/8243073.png',
    csv: 'https://cdn-icons-png.flaticon.com/512/8242/8242984.png',
    zip: 'https://cdn-icons-png.flaticon.com/512/6861/6861248.png',
    img: link,
    docx: 'https://cdn-icons-png.flaticon.com/512/8242/8242988.png',
    music: 'https://cdn-icons-png.flaticon.com/512/2306/2306139.png',
    txt: 'https://cdn-icons-png.flaticon.com/512/8243/8243060.png',
    ppt: 'https://cdn-icons-png.flaticon.com/512/337/337949.png',
    other: 'https://cdn-icons-png.flaticon.com/512/535/535761.png',
    svg: 'https://cdn-icons-png.flaticon.com/512/5063/5063253.png'
  };
  const gridSpacing = 3;
  const fileExtension = fileType.toLowerCase();
  const displayImage =
    fileExtension === 'pdf'
      ? defaultImages.pdf
      : fileExtension === 'csv'
        ? defaultImages.csv
        : fileExtension === 'txt'
          ? defaultImages.txt
          : fileExtension === 'pptx'
            ? defaultImages.ppt
            : fileExtension === 'xlsx'
              ? defaultImages.xlsx
              : fileExtension === 'docx' || fileExtension === 'doc'
                ? defaultImages.docx
                : fileExtension === 'zip'
                  ? defaultImages.zip
                  : fileExtension === 'svg'
                    ? defaultImages.svg
                    : fileExtension === 'png' || fileExtension === 'jpg'
                      ? defaultImages.img
                      : defaultImages.other;
  return (
    <div className="h-[160px] w-[200px] overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg dark:bg-gray-800">
      {fileType && (
        <div className="relative h-[110px] w-full">
          <img
            src={displayImage}
            alt="File preview"
            className={`h-full w-full object-contain`}
            style={{
              transform:
                fileExtension === 'png' ||
                fileExtension === 'jpeg' ||
                fileExtension === 'jpg'
                  ? ''
                  : 'scale(0.8)',
              width: '100%',
              objectFit: 'contain'
            }}
          />
        </div>
      )}
      <div className="bg-gray-200 p-2 dark:bg-gray-700">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-grow">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
              {truncatedTitle}
            </p>
          </div>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2"
          >
            <ArrowDownToLine
              size={16}
              className="h-5 w-5 cursor-pointer text-gray-900 dark:text-gray-100"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

AttachmentCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.object
  ])
};

export default AttachmentCard;

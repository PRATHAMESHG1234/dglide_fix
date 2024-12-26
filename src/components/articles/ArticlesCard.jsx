import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Heart } from 'lucide-react';
import { Share } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import { CardMedia, Grid } from '@mui/material';
import SubCard from '../../elements/SubCard';
import Card1 from '../../assets/cards/card-1.jpg';
import Card2 from '../../assets/cards/card-2.jpg';
import Card3 from '../../assets/cards/card-3.jpg';
import { colors } from '../../common/constants/styles';
import moment from 'moment';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

const ArticlesCard = ({ data, index }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { author, title, category, uuid } = data || {};

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleCardContentClick = () => {
    try {
      navigate('/articles/editor?uuid=' + uuid);
    } catch (error) {
      console.error('Error fetching record:', error);
    }
  };

  const getTimeDifference = (timeString) => {
    const time = moment(timeString, 'YYYY-MM-DD HH:mm:ss');
    const now = moment();
    const diff = now.diff(time);

    if (diff < 3600000) {
      // less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `Last updated ${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) {
      // less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `Last updated ${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      // more than 1 day
      const days = Math.floor(diff / 86400000);
      return `Last updated ${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  const cardStyle = {
    background: '#f8fafc',
    border: '1px solid',
    borderColor: '#eef2f6',
    boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px'
  };
  const cards = [Card1, Card2, Card3];
  const card = cards[index % cards.length];

  return (
    <>
      <div
        className="w-full transform cursor-pointer transition-transform duration-300 hover:scale-105"
        onClick={() => handleCardContentClick()}
      >
        <div className="overflow-hidden rounded bg-white shadow-md">
          <img src={card} alt="Card 1" className="w-full" />
          <div className="p-4">
            <div className="flex flex-col space-y-1">
              <div>
                <p className="text-sm font-medium text-gray-900">{title}</p>
              </div>
              <div>
                <p className="text-xs font-normal text-gray-700">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 py-2">
            <div className="flex items-center">
              <p className="ml-1 text-xs font-normal text-gray-700">
                {getTimeDifference(data?.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArticlesCard;

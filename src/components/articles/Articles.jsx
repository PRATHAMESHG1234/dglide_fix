import * as React from 'react';
import ArticlesCard from './ArticlesCard';
import {
  Button,
  Container,
  Grid,
  InputAdornment,
  Menu,
  MenuItem,
  OutlinedInput,
  Pagination,
  TextField,
  Typography
} from '@mui/material';
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { fetchRecords } from '../../services/table';
import { colors } from '../../common/constants/styles';
import MainCard from '../../elements/MainCard';
import { useSelector } from 'react-redux';
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { Input } from '@/componentss/ui/input';
import { Search } from 'lucide-react';
const Articles = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allArticle, setAllArticle] = useState(true);
  const [publishedArticle, setPublishedArticle] = useState(false);
  const [draftsArticle, setDraftsArticle] = useState(false);
  const [articlesData, setArticlesData] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const { currentTheme } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRecords('articles', {}).then((data) => setArticlesData(data.data));
  }, []);

  useEffect(() => {
    const filteredData = articlesData.filter((article) => {
      return article.title.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredArticles(filteredData);
  }, [search, articlesData]);

  const handleSearch = (event) => {
    const trimmedValue = event.target.value.trimStart();
    setSearch(trimmedValue);
  };

  return (
    <>
      <div
        className={`min-h-screen w-full p-4 ${
          currentTheme === 'Dark' ? 'bg-dark-level2' : 'bg-white'
        }`}
      >
        {/* Title Section */}
        <div className="mb-6 flex items-center justify-between">
          {/* Title */}
          <div>
            <h1
              className={`text-lg font-semibold ${
                currentTheme === 'Dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              Articles
            </h1>
          </div>
          {/* Search Input */}
          <div>
            <Input
              id="input-search-card-style1"
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
              startIcon={<Search size={16} className="cursor-pointer" />}
            />
          </div>
        </div>

        {/* Articles Flex Layout */}
        <div className="flex flex-wrap gap-6">
          {filteredArticles.map((article, index) => (
            <div className="max-w-[15rem] flex-grow">
              <ArticlesCard key={article.uuid} data={article} index={index} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Articles;

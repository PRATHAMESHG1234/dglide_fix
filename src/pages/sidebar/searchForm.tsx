import { Search } from 'lucide-react';
import { Label } from '@/componentss/ui/label';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput
} from '@/componentss/ui/sidebar';
import { useState } from 'react';

interface SearchFormProps extends React.ComponentProps<'form'> {
  nestedData: any[];
  onSearch: (query: string) => void; // Pass search function from the parent
}

export function SearchForm({
  nestedData,
  onSearch,
  ...props
}: SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Handler for search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query); // Call the onSearch prop from parent to filter data
  };

  return (
    <form {...props}>
      <SidebarGroup className="p-0 py-0 pr-1">
        <SidebarGroupContent className="relative p-0">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search forms here..."
            className="pl-9"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Search className="pointer-events-none absolute left-[0.9rem] top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}

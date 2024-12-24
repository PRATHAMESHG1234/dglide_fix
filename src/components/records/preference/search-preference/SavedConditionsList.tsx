import React from 'react';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Trash2 } from 'lucide-react';

interface Filter {
  searchPreferenceId: string;
  name: string;
}

interface SavedConditionsListProps {
  filters: Filter[];
  filterSelected: Filter | null;
  handleOnFilterSelected: (selectedId: string) => void;
  deleteHandler: () => void;
}

const SavedConditionsList: React.FC<SavedConditionsListProps> = ({
  filters,
  filterSelected,
  handleOnFilterSelected,
  deleteHandler
}) => {
  return (
    <div className="flex w-full items-center gap-x-1">
      <Dropdown
        label="Saved conditions"
        id="input_category"
        options={filters?.map((fltr) => ({
          value: fltr.searchPreferenceId,
          label: fltr.name
        }))}
        value={filterSelected ? filterSelected.searchPreferenceId : ''}
        onChange={(e) => handleOnFilterSelected(e.target.value)}
        placeholder="Select a condition"
        name="savedConditions"
      />

      {filterSelected && (
        <div
          className="mt-5 cursor-pointer rounded-md bg-accent p-2 text-destructive hover:bg-destructive hover:text-white"
          onClick={deleteHandler}
        >
          <Trash2 size={20} />
        </div>
      )}
    </div>
  );
};

export default SavedConditionsList;

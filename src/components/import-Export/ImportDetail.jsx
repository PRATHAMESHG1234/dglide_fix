import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchModules } from '../../redux/slices/moduleSlice';
import { getDumpBySchema } from '../../redux/slices/dumpSlice';
// import {Button} from '@/componentss/ui/button'
import { colors } from '../../common/constants/styles';
import { truncateStringByWords } from '../../common/constants/helperFunction';
import { Input } from '@/componentss/ui/input';
import { Dropdown } from '@/componentss/ui/dropdown';
import { Button } from '@/componentss/ui/button';

import { Avatar, AvatarFallback, AvatarImage } from '@/componentss/ui/avatar';
import { X } from 'lucide-react';

export const ImportDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [importPanel, setImportPanel] = useState(false);
  const [selectedModule, setSelectedModule] = useState('');
  const [selectedSchema, setSelectedSchema] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { modules } = useSelector((state) => state.module);

  useEffect(() => {
    dispatch(fetchModules());
  }, []);

  const uploadLogoHandler = async (file) => {
    setFileName(file.name);
    setSelectedSchema(file);
  };

  const handleDelete = () => {
    setFileName('');
    setSelectedSchema('');
  };

  const handleImportSchema = async () => {
    setLoading(true);
    try {
      if (selectedSchema && selectedModule) {
        await dispatch(
          getDumpBySchema({
            file: selectedSchema,
            moduleInfoId: selectedModule
          })
        ).then((res) => {
          console.log(res, 'resss');
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  return (
    <div className="w-96 px-4">
      <div>
        <div className="mb-3">
          <Dropdown
            label="Please select Module for Import schema"
            name="formInfoId"
            id="input_category"
            options={modules.map((o) => ({
              label: o.displayName,
              value: o.moduleInfoId
            }))}
            value={selectedModule}
            onChange={(event) => setSelectedModule(event.target.value)}
          />
        </div>
        <div>
          <Input
            className="p-1"
            accept=".json"
            ref={hiddenFileInput}
            type="file"
            name="logo"
            onClick={(e) => {
              e.currentTarget.value = null;
            }}
            onInput={(e) => uploadLogoHandler(e.target.files[0])}
            style={{ display: 'none' }}
          />
          {selectedSchema ? (
            <div className="my-3">
              <div className="flex">
                <span
                  className="text-initial mr-2 flex cursor-pointer items-center rounded-xl bg-[#f9dccf] px-4 py-2 text-sm hover:shadow"
                  style={{ boxFlexGroup: 'hsl(19deg 53.03% 83.57%);' }}
                >
                  {truncateStringByWords(fileName, 2)}

                  <X
                    className="ms-5 rounded-full bg-primary p-1 text-xs"
                    onClick={handleDelete}
                  />
                </span>
              </div>
            </div>
          ) : selectedModule ? (
            <div className="my-3">
              <Button onClick={handleClick}>Choose file</Button>
            </div>
          ) : null}
        </div>
      </div>
      <Button onClick={handleImportSchema} disabled={loading} className="mt-2">
        {loading ? (
          <>
            <div className="mx-auto flex min-w-full max-w-screen-lg items-center justify-center">
              <div className="spinner-border inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"></div>
            </div>
            Importing...
          </>
        ) : (
          'Import'
        )}
      </Button>
    </div>
  );
};

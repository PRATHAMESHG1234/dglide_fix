import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchRecordById } from '../../services/table';

const TextEditor = () => {
  const [searchParams] = useSearchParams();
  const [apiResponse, setApiResponse] = useState(null);

  const getData = async () => {
    try {
      const response = await fetchRecordById(
        'articles',
        searchParams.get('uuid')
      );
      setApiResponse(response);
    } catch (error) {
      console.error('Error fetching record:', error);
    }
  };

  useEffect(() => {
    getData();
  }, [searchParams.get('uuid')]);

  const renderDetails = () => {
    if (!apiResponse) {
      return <p>Loading...</p>;
    }
    const URL = process.env.REACT_APP_STORAGE_URL;
    const updatedData = apiResponse.details?.replace(/STORAGE_URL/g, URL);

    return (
      <div>
        <p>{apiResponse.title}</p>
        <div dangerouslySetInnerHTML={{ __html: updatedData }} />
      </div>
    );
  };

  return <div>{renderDetails()}</div>;
};

export default TextEditor;

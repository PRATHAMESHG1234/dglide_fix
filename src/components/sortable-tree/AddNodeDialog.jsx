import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button } from '@/componentss/ui/button';
import TextField from '../../elements/TextField';
import { COLORS } from '../../common/constants/styles';

const AddNodeDialog = ({ initialNodeText, onSave, onCancel }) => {
  const [nodeText, setNodeText] = useState(initialNodeText);

  useEffect(() => {
    setNodeText(initialNodeText);
  }, [initialNodeText]);

  const handleSave = () => {
    onSave(nodeText);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Card
      style={{
        maxWidth: 320,
        margin: 'auto',
        marginTop: 50,
        padding: '10px',
        borderRadius: '5px'
      }}
    >
      <CardContent
        style={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          alignItems: 'center',
          border: '1px solid lightgrey',
          borderRadius: '5px'
        }}
      >
        <TextField
          labelname="Enter node name"
          variant="outlined"
          value={nodeText}
          onChange={(e) => setNodeText(e.target.value)}
          autoFocus
          fullwidth
          sx={{
            '& .MuiInputBase-root': {
              height: '35px',
              fontSize: '13.5px',
              borderRadius: '3px'
            },
            bgcolor: COLORS.WHITE
          }}
          fieldstyle={{
            minWidth: '280px'
          }}
          labelstyle={{
            fontWeight: 'bold'
          }}
        />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>

          <Button onClick={handleSave}>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddNodeDialog;

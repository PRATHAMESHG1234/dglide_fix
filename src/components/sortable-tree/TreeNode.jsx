import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Edit2,
  Plus,
  PlusCircle,
  Save,
  Trash,
  XCircle
} from 'lucide-react';
import IconButton from '@mui/material/IconButton';
import NodeContainedFields from './NodeContainedFields';
import TextField from '../../elements/TextField';
import { colors } from '../../common/constants/styles';
import { Tooltip } from '@mui/material';

const TreeNode = ({
  node,
  depth,
  isOpen,
  onToggle,
  onAddChildNode,
  onDeleteNode,
  onUpdateNode
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(node.displayName);
  const [showFieldsPage, setShowFieldsPage] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleSaveEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onUpdateNode({ ...node, displayName: editedText });
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setEditedText(node.displayName);
    setIsEditing(!isEditing);
  };

  return (
    <>
      <div
        className={`tree-node depth-${depth}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowFieldsPage(true)}
      >
        <div className="node-content">
          <span
            className="toggle-icon"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onToggle();
            }}
          >
            {isOpen ? (
              <ChevronDown fontSize="small" />
            ) : (
              <ChevronRight fontSize="small" />
            )}
          </span>
          {!isEditing ? (
            <>
              <span className="node-text">
                {node?.displayName?.length > (isHovered ? 10 : 18)
                  ? `${node.displayName.substring(0, isHovered ? 10 : 18)}...`
                  : node.displayName}
              </span>
              {isHovered && (
                <div className="action-icons">
                  <Tooltip title="Add Child Node" arrow>
                    <IconButton
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onAddChildNode(node.id);
                        onToggle();
                      }}
                    >
                      <PlusCircle fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {node.parent !== 0 && (
                    <>
                      <Tooltip title="Edit Node" arrow>
                        <IconButton
                          className="action-button"
                          style={{ color: '#007bff' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleEditClick();
                          }}
                        >
                          <Edit2 fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete Node" arrow>
                        <IconButton
                          className="action-delete-button"
                          style={{ color: 'red' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            onDeleteNode(node.id);
                          }}
                        >
                          <Trash fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="edit-mode flex items-center justify-center">
              <TextField
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                variant="outlined"
                size="small"
                style={{
                  '& .MuiInputBase-root': {
                    height: '30px',
                    fontSize: '13.5px',
                    borderRadius: '3px'
                  },
                  bgcolor: colors.white
                }}
                fieldstyle={{
                  minWidth: '120px'
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <Tooltip title="Save Changes" arrow>
                <IconButton onClick={handleSaveEdit} size="small">
                  <Save
                    fontSize="small"
                    style={{ color: colors.primary.main }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="Cancel Edit" arrow>
                <IconButton onClick={handleCancelEdit} size="small">
                  <XCircle
                    fontSize="small"
                    style={{ color: colors.error.light }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
      </div>
      <NodeContainedFields
        onClose={() => setShowFieldsPage(false)}
        open={showFieldsPage}
        nodeDetails={node}
      />
    </>
  );
};

export default TreeNode;

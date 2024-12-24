import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Tree } from '@minoru/react-dnd-treeview';
import TreeNode from './TreeNode';
import AddNodeDialog from './AddNodeDialog';
import './TreeStructure.css';

import { useDispatch } from 'react-redux';
import {
  createForm,
  deleteForm,
  editForm,
  fetchFormByName,
  fetchTreeListByFormName
} from '../../services/form';

import Loader from '../shared/Loader';
import { notify } from '../../hooks/toastUtils';

const TreeStructure = () => {
  const dispatch = useDispatch();
  const [treeData, setTreeData] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [newNodeParent, setNewNodeParent] = useState(null);
  const [editNode, setEditNode] = useState(null);
  const [selectedForm, setSelectedForm] = useState({});
  const [loading, setLoading] = useState(true);

  const pathname = window.location.pathname;
  const urlSegments = pathname.split('/');
  const formName = urlSegments[3];

  useEffect(() => {
    const getFormByName = async () => {
      if (formName) {
        const res = await fetchFormByName(formName);
        setSelectedForm(res.result);
      }
    };

    getFormByName();
  }, [formName]);

  useEffect(() => {
    const fetchTreeList = async () => {
      if (formName) {
        const res = await fetchTreeListByFormName(formName);
        const result = res?.result;
        if (!res) return;
        const transformedData = await result?.map((obj) => {
          const { parentFormId, formInfoId } = obj;
          return { ...obj, parent: parentFormId, id: formInfoId };
        });

        setTreeData(transformedData);
        setLoading(false);
      }
    };
    fetchTreeList();
  }, [selectedForm]);

  const generateNodeName = (label) => {
    return label?.toLowerCase().replace(/\s+/g, '_');
  };

  const createNode = async (data) => {
    const { displayName, parentFormId } = data;
    const name = generateNodeName(displayName);
    const updatedPayload = {
      description: displayName,
      displayName,
      name,
      parentFormId,
      tree: true,
      moduleInfoId: selectedForm?.moduleInfoId
    };

    if (!displayName) return;
    const res = await createForm(updatedPayload);

    const result = await res?.result;
    if (res) {
      if (res.status) {
        const transformedObject = {
          ...result,
          parent: result.parentFormId,
          id: result.formInfoId
        };
        setTreeData((prevTreeData) => [...prevTreeData, transformedObject]);
      }

      if (res.status) {
        notify.success(res.message);
      } else {
        notify.error(res.message);
      }
    }
  };

  const handleSaveNode = (displayName) => {
    const newNode = {
      id: nextId,
      parentFormId: newNodeParent || 0,
      displayName
    };
    setNextId(nextId + 1);
    setNewNodeParent(null);
    createNode(newNode);
  };

  const handleCancelNode = () => {
    setNewNodeParent(null);
    setEditNode(null);
  };

  const handleDeleteNode = async (id) => {
    if (id) {
      const res = await deleteForm(id);

      if (res) {
        if (res.status || res.result === id) {
          setTreeData((prevTreeData) =>
            prevTreeData?.filter((node) => node.id !== id)
          );
        }
        if (res.status) {
          notify.success(res.message);
        } else {
          notify.error(res.message);
        }
      }
    }
  };

  const onUpdateNode = async (updatedNode) => {
    const formInfoId = updatedNode?.formInfoId;
    if (!formInfoId) return;

    try {
      const res = await editForm(formInfoId, updatedNode);
      const result = res?.result;

      if (res) {
        if (res.status || result.formInfoId === formInfoId) {
          setTreeData((prevTreeData) =>
            prevTreeData.map((node) =>
              node.id === updatedNode.id
                ? { ...node, displayName: updatedNode.displayName }
                : node
            )
          );
        }
        if (res.status) {
          notify.success(res.message);
        } else {
          notify.error(res.message);
        }
      }
    } catch (error) {
      notify.error('An error occurred while updating the node.');
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="tree-container">
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <TreeNode
              key={node.id}
              node={node}
              depth={depth}
              isOpen={isOpen}
              onToggle={onToggle}
              onAddChildNode={setNewNodeParent}
              onDeleteNode={handleDeleteNode}
              onUpdateNode={onUpdateNode}
            />
          )}
        />
        {newNodeParent !== null && (
          <AddNodeDialog
            initialNodeText={newNodeParent !== null ? '' : editNode.label}
            onSave={handleSaveNode}
            onCancel={handleCancelNode}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default TreeStructure;

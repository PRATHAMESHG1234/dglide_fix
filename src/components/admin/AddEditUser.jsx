import React, { useEffect, useState } from 'react';
import { fetchFieldsWithValuesForReference } from '../../services/field';
import { fetchRecordsBytableName } from '../../services/table';
import { fetchFormByName } from '../../services/form';
import { saveUser, userandGroup } from '../../services/auth';
import AddEditRecord from '../modify-record/addEditRecord/AddEditRecord';
import { fetchFieldGroups } from '../../services/fieldGroup';
import { notify } from '../../hooks/toastUtils';
import { MultiSelect } from '@/componentss/ui/multi-select';

const AddEditUser = ({
  fieldValues,
  setDrawer,
  drawer,
  setFetchData,
  formId
}) => {
  const [fields, setFields] = useState([]);
  const [fieldsData, setFieldsData] = useState({});
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [currentRole, setCurrentRole] = useState([]);
  const [currentGroup, setCurrentGroup] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fieldGroups, setFieldGroups] = useState([]);

  const userFormName = 'system_user';
  const rolesFormName = 'system_role';
  const groupsFormName = 'system_group';

  useEffect(() => {
    setLoading(true);
    if (userFormName && drawer) {
      fetchFormByName(userFormName).then((data) => {
        fetchFields(data.result);
      });
    }
  }, [userFormName, drawer]);
  const fetchGroups = async (formInfoId) => {
    const res = await fetchFieldGroups(formInfoId);
    setFieldGroups(res);
  };
  const fetchFields = (formDetails) => {
    const formInfoId = formDetails?.formInfoId;
    if (formInfoId) {
      fetchGroups(formInfoId);
      fetchFieldsWithValuesForReference(formInfoId)
        .then((data) => {
          setFields(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching form fields:', error);
        });
    }
  };

  useEffect(() => {
    if (rolesFormName) {
      fetchRecordsBytableName(rolesFormName).then((data) => {
        const rolesData = data?.data?.map((d) => ({
          label: d.name,
          value: d.uuid
        }));
        setRoles(rolesData);
      });
    }

    if (groupsFormName) {
      fetchRecordsBytableName(groupsFormName).then((data) => {
        const groupsData = data?.data?.map((d) => ({
          label: d.group_name,
          value: d.uuid
        }));
        setGroups(groupsData);
      });
    }
  }, [rolesFormName, groupsFormName]);
  useEffect(() => {
    if (currentGroup) {
      setFieldsData((prev) => ({ ...prev, groups: currentGroup }));
    }
  }, [currentGroup]);
  useEffect(() => {
    if (currentRole) {
      setFieldsData((prev) => ({ ...prev, roles: currentRole }));
    }
  }, [currentRole]);
  const onFormValueChanged = (e) => {
    const { name, value } = e.target;
    setFieldsData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const submitHandler = (data) => {
    if (!data && !fieldsData.roles && !fieldsData.groups) return;

    const userData = {
      groups: fieldsData.groups || [],
      payload: data,
      roles: fieldsData.roles || []
    };
    // setDrawer(false);
    setFetchData(true);
    saveSystemUser(userData);
  };

  const saveSystemUser = (data) => {
    saveUser(data).then(() => {
      notify.success('Data Updated succesfully');
      setDrawer(false);
      setFetchData(true);
    });
  };

  async function FetchGroupRoles(val) {
    userandGroup(val).then((res) => {
      const fetchedGroups = res?.result.groups || [];
      const fetchedRoles = res?.result?.roles;

      const mappedGroups = fetchedGroups?.map((group) => group?.groupUUID);
      const mappedRoles = fetchedRoles?.map((role) => role?.roleUUID);
      setCurrentGroup(mappedGroups);
      setCurrentRole(mappedRoles);
    });
  }

  useEffect(() => {
    if (fieldValues) {
      FetchGroupRoles(fieldValues?.uuid);
    }
  }, [fieldValues]);

  if (loading) {
    return '';
  }
  return (
    <AddEditRecord
      formId={formId}
      fieldData={fields || []}
      mode="preview"
      fieldValues={fieldValues}
      onSubmit={submitHandler}
      fieldGroups={fieldGroups}
      otherFields={
        <div className="flex w-full flex-wrap items-center justify-start gap-4">
          <div className="w-full">
            <MultiSelect
              id="multiSelect-roles"
              label="Roles"
              name="roles"
              selectedValues={fieldsData.roles || []}
              onChange={onFormValueChanged}
              options={roles}
            />
          </div>
          <div className="w-full">
            <MultiSelect
              id="multiSelect-groups"
              label="Groups"
              name="groups"
              selectedValues={fieldsData.groups || []}
              onChange={onFormValueChanged}
              options={groups}
            />
          </div>
        </div>
      }
    />
  );
};

export default AddEditUser;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const formName = 'system_message_template';
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/admin/notification/${formName}?title=Event Template`);
  });
  return <></>;
};
export default Notification;

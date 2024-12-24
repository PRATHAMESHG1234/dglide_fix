import React from 'react';
import { Link } from 'react-router-dom';

const currentYear = new Date().getFullYear();

const AuthFooter: React.FC = () => (
  <div className="flex items-center justify-between">
    <Link to="/" className="text-sm font-normal text-secondary hover:underline">
      {window?.location?.host}
    </Link>
    <Link to="/" className="text-sm font-normal text-secondary hover:underline">
      &copy; {currentYear}
    </Link>
  </div>
);

export default AuthFooter;

import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// ========================|| UNDER CONSTRUCTION PAGE ||======================== //

const UnderConstruction = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  return loading ? (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
      <Loader2 className="h-12 w-12 animate-spin text-secondary" />
    </div>
  ) : (
    <div></div>
  );
};

export default UnderConstruction;

import { useState, useEffect } from 'react';

const usePath = () => {
    const [path, setPath] = useState('');
  
    useEffect(() => {
      const currentPath = window.location.pathname.split('/')[1];
      setPath(currentPath);
    }, []);
  
    return path;
  };
  
export default usePath;

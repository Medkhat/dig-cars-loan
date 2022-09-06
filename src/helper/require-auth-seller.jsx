import { useLocation } from 'react-router-dom';

export const RequireAuthSeller = ({ children }) => {
  const location = useLocation();

  /*  if (false) {
    return <Navigate to='/404' state={{ from: location }} replace />;
  }*/

  return children;
};

import React from 'react'
import { useNavigate } from 'react-router-dom';

function PublicRoute({children}) {
    const navigate = useNavigate();
    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  return (
    <div>{children}</div>
  )
}

export default PublicRoute

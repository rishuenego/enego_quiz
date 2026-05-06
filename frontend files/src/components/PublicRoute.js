import React from 'react'
import { useNavigate } from 'react-router-dom';

function PublicRoute({children}) {
    const navigate = useNavigate();
    React.useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [])
  return (
    <div>{children}</div>
  )
}

export default PublicRoute

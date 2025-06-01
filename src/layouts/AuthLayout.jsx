import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <Outlet />
    </div>
  );
}

export default AuthLayout;

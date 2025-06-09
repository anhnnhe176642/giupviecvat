import { useContext } from 'react';
import { AuthContext } from '../conext/AuthContext';

function Dashboard() {
  const { user } = useContext(AuthContext)

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {user && (
        <p className="mt-4">Hello, {user.name || 'User'}!</p>
      )}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            <li className="px-4 py-4">Example task 1</li>
            <li className="px-4 py-4">Example task 2</li>
            <li className="px-4 py-4">Example task 3</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

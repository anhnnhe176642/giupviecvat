import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl mt-4">Page not found</p>
      <Link to="/" className="mt-8 text-indigo-600 hover:text-indigo-800">
        Go back to home
      </Link>
    </div>
  );
}

export default NotFound;

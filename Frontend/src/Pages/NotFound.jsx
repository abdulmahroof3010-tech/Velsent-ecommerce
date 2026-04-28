import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-red-500">404</h1>
      <p className="mt-2 text-gray-600">Page not found</p>

      <Link
        to="/"
        className="mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Go to Home
      </Link>
    </div>
  );
}

export default NotFound;

import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-deloitte-charcoal">
      {/* Navigation */}
      <nav className="bg-deloitte-dark border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-deloitte-green text-xl font-bold">
                  Customer Feedback Analysis
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/')
                      ? 'border-deloitte-green text-deloitte-green'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/upload"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/upload')
                      ? 'border-deloitte-green text-deloitte-green'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  Upload
                </Link>
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'border-deloitte-green text-deloitte-green'
                      : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
                  }`}
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/')
                  ? 'bg-deloitte-dark border-deloitte-green text-deloitte-green'
                  : 'border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              to="/upload"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/upload')
                  ? 'bg-deloitte-dark border-deloitte-green text-deloitte-green'
                  : 'border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white'
              }`}
            >
              Upload
            </Link>
            <Link
              to="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/dashboard')
                  ? 'bg-deloitte-dark border-deloitte-green text-deloitte-green'
                  : 'border-transparent text-gray-300 hover:bg-gray-700 hover:border-gray-300 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

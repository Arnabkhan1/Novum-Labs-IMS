const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-primary">
    <h1 className="text-4xl font-bold text-white">404 - Page Not Found</h1>
    <a href="/login" className="mt-4 text-accent hover:underline">Go Back to Login</a>
  </div>
);
export default NotFound;

const NotAuthorized = () => (
  <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-secondary to-primary">
    <h1 className="text-4xl font-bold text-white">403 - Unauthorized Access</h1>
    <a href="/login" className="mt-4 text-accent hover:underline">Return to Login</a>
  </div>
);
export default NotAuthorized;

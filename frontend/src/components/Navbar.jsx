const Navbar = ({ name, role }) => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b border-white/20 backdrop-blur-xl bg-white/10">
      <div>
        <h1 className="text-lg font-semibold">Welcome, {name || "User"} 👋</h1>
        <p className="text-sm text-[#7ED6F4] capitalize">{role}</p>
      </div>
      <div className="text-sm text-white/70">
        {new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </div>
    </nav>
  );
};

export default Navbar;

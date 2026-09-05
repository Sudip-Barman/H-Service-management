const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      {children}
    </div>
  );
};

export default MainLayout;
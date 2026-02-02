const DashboardLayout = ({ children, currentTab, onTabChange, SidebarComponent }) => {
  return (
    <div className="bg-white dark:bg-zinc-950 text-neutral-900 dark:text-white font-sans h-screen flex overflow-hidden selection:bg-primary/10 transition-colors duration-300 relative">
      {SidebarComponent ? <SidebarComponent currentTab={currentTab} onTabChange={onTabChange} /> : null}

      <main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-950 relative transition-colors duration-300">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

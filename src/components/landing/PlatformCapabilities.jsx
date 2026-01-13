import MagicBento from '../ui/MagicBento';

const PlatformCapabilities = () => {
  const capabilities = [
    {
      label: "insights",
      title: "Performance Analytics",
      description: "Track progress metrics",
    },
    {
      label: "leaderboard",
      title: "Global Leaderboards",
      description: "Compete and rank",
    },
    {
      label: "bug_report",
      title: "Automated Testing",
      description: "Instant feedback metrics",
    },
    {
      label: "groups",
      title: "Real-time Sync",
      description: "Collaborate on code",
    },
    {
      label: "video_camera_front",
      title: "Mock Environments",
      description: "Practice with AI",
    },
    {
      label: "architecture",
      title: "System Design Canvas",
      description: "Design distributed systems",
    }
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-frontier-black relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-white/20"></div>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-serif text-gray-900 dark:text-white">Platform Capabilities</h2>
        </div>

        <MagicBento cards={capabilities} textAutoHide={false} />
      </div>
    </section>
  );
};

export default PlatformCapabilities;

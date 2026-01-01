const CTA = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-frontier-black border-t border-white/10">
      <div className="max-w-5xl mx-auto bg-[#0F0F0F] border border-white/20 rounded p-12 text-center relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/25 rounded-full blur-[80px]"></div>
        <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white relative z-10 drop-shadow-md">Deploy your potential.</h2>
        <p className="text-lg text-gray-300 mb-10 max-w-lg mx-auto relative z-10 font-light">
          Join the network of passionate developers building the next generation of software.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10 font-mono text-sm">
          <button className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded shadow-[0_0_20px_rgba(249,115,22,0.4)] transition hover:scale-105 duration-200">
            Initialize Account
          </button>
          <button className="px-8 py-4 bg-transparent border border-gray-500 hover:border-white text-gray-300 hover:text-white font-bold rounded transition hover:bg-white/5">
            Browse_Problems
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTA;

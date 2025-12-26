const NewsDetailContent = () => {
  return (
    <div className="prose prose-invert prose-lg prose-orange max-w-none mb-16">
      <p className="lead text-xl text-gray-300 font-light border-l-2 border-primary pl-4 mb-8">
        We've completely rewritten our execution engine in Rust. Experience 50% faster compile times, new memory visualization tools, and real-time collaboration with zero latency. The frontier just got faster.
      </p>
      <p>
        Since the inception of Codegamy, our mission has been to provide a coding environment that feels less like a browser tab and more like a native IDE. With the release of v3.0, we are taking a massive leap towards that reality. The bottleneck has always been the bridge between the client-side editor and our server-side execution containers.
      </p>
      <h2 className="text-2xl font-serif mt-10 mb-4 text-white">Why Rust?</h2>
      <p>
        Moving from our legacy Node.js backend to a highly optimized Rust infrastructure wasn't just about raw speed—though the benchmarks are impressive. It was about <span className="text-primary font-mono text-sm">memory_safety</span> and concurrency.
      </p>
      <div className="my-8 relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-terminal-purple rounded-lg blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-[#0F0F0F] rounded-lg border border-white/10 p-4 font-mono text-sm overflow-x-auto shadow-2xl">
          <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-2">
            <span className="text-xs text-gray-500">src/engine/executor.rs</span>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
          </div>
          <pre className="text-gray-300"><code><span className="text-terminal-purple">use</span> std::time::Instant;
<span className="text-primary">pub fn</span> <span className="text-terminal-blue">execute_container</span>(code: &amp;str) -&gt; Result&lt;Output, Error&gt; {'{'}
    <span className="text-gray-500">// Initialize high-precision timer</span>
    <span className="text-primary">let</span> start = Instant::<span className="text-terminal-blue">now</span>();
    <span className="text-gray-500">// Direct memory mapping for zero-copy execution</span>
    <span className="text-primary">let</span> memory_map = <span className="text-terminal-blue">allocate_safe_region</span>(1024)?; 
    <span className="text-terminal-green">println!</span>("Container spun up in: {'{'}:?{'}'}", start.elapsed());
    Ok(Output::new())
{'}'}</code></pre>
        </div>
      </div>
      <p>
        The snippet above demonstrates how we handle container initialization. By leveraging Rust's ownership model, we ensure that every execution context is completely isolated without the overhead of heavy garbage collection cycles.
      </p>
      <h3 className="text-xl font-serif mt-8 mb-3 text-white">Visualizing the Stack</h3>
      <p>
        One of the most requested features from our community was better debugging tools for recursion and memory leaks. The new IDE includes a real-time <strong>Memory Graph</strong>. You can now see the stack grow and shrink as your algorithms execute.
      </p>
      <blockquote className="bg-white/5 border-l-4 border-primary p-4 my-6 rounded-r font-serif italic">
        "The new visualization tools helped me understand Dynamic Programming in a way no textbook ever did. It's like seeing the matrix."
        <footer className="mt-2 not-italic font-mono text-xs text-primary">— Beta Tester @Algorithm_Ninja</footer>
      </blockquote>
      <h2 className="text-2xl font-serif mt-10 mb-4 text-white">What's Next?</h2>
      <p>
        This update is live for all users starting today. We are rolling out the collaborative features in waves to ensure stability. Check your dashboard for the "Enable v3.0" toggle.
      </p>
    </div>
  );
};

export default NewsDetailContent;

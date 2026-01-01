const DeveloperLogs = () => {
  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "@Google",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnxgqFR0xyBu5oVY7BQGTwy47Td27ceXNjVD2JD72UFxpbPbrSXkthZhbgI557xYsYAfH5G_PkBs8SJ3FjaYxpXwivF21xC5joDd5dfgX4x78vG-jx6AiNtJwJUTpbUupsv9sSl3X82vR_9V1Ov4tgrIl-U3J0rNz4OQsttMBg8R5XA3mP7M93PDbt0DvchM3KK0TJwguRtEBeN_XX5RPXdEIF7VVbJAtlCUUAStWM8r45yLxxPyACYA1B3a_6uiE5yPjLpIF9-6qE",
      quote: "TrickCode's interview prep section is a lifesaver. The curated questions helped me land my role at a top tech giant. System is flawless."
    },
    {
      name: "Michael Chen",
      role: "Full Stack Dev",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpalTd_V6sClNwqCVKJgM4isUC2WfFWTx91IJxinq4DaoZOIv3wFanw8O5ng5LoJaLei4zyQZsUgPUTbc8niJwJsXyxAAQObkwPiEiV5BJJnPXSYwT-otJM8n9LpvbAY8Q9cbYZSl8CSvCAEo_A9fzyL_EWUL9cnI24Lm-5weDyRDjcVhnZdNbpqn8Co2h3r7Dcm-x0Ljc5jBdClWbieUKbbu89xEY8VF3tiBgfvsNdSMTDQwg1L0VntWijwrOSj86bjmA5L-In6bB",
      quote: "The weekly contests are incredibly engaging. It's the best way to keep my algorithms skills sharp while having fun. Highly optimized."
    },
    {
      name: "Elena Rodriguez",
      role: "CS Student",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBYQGriPxvjPfpCagP_cOJZ72Tf3qwxK2c3NZinNHboNU01CAmoXwtI8LullPaf-Q3zSPaQ_xh2zWP8c6pTjpccTVAZkMFqGpq79C9o8xQLyFhGSe1vVvmz8ZtKDZ-SgbHnr58b0szvbFGAZJxQbkEwFbrp_1zI3MCTOoZC9yGsBXfJfV2mBY2C479KUlyqDjSAvZwWBQPLIlD2lO_b5sktMLnQOoi21OpeMQS0568JkNcauGPTos8Y0oKJWyVyTrRT4e_CJDhS5S2",
      quote: "I love the collaborative editor. Being able to solve problems with my study group in real-time changed how we learn. A breakthrough tool."
    }
  ];

  return (
    <section className="py-24 bg-frontier-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-3xl font-serif text-white mb-16 text-left">Developer Logs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-t border-white/10">
          {testimonials.map((testimonial) => (
            <div key={testimonial.name} className="bg-frontier-card p-10 border-r border-b border-white/10 hover:bg-[#202023] transition duration-300">
              <div className="flex items-center gap-4 mb-8">
                <img 
                  alt={`User ${testimonial.name}`} 
                  className="w-10 h-10 rounded grayscale border border-white/20" 
                  src={testimonial.image}
                />
                <div>
                  <h4 className="font-bold text-white text-sm font-mono">{testimonial.name}</h4>
                  <p className="text-xs text-gray-400 font-mono">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-300 italic text-sm leading-7 font-light">
                "{testimonial.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeveloperLogs;

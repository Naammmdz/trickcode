import { useState } from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "Is TrickCode free for beginners?",
      answer: "Yes! You can start practicing problems and participating in weekly contests completely for free. We also offer a Premium plan which unlocks advanced video interview preparations."
    },
    {
      question: "How do the live coding contests work?",
      answer: "Contests are held weekly. You'll have a set amount of time to solve 3-4 algorithmic problems. Points are awarded based on correctness and speed."
    },
    {
      question: "Which programming languages are supported?",
      answer: "We support over 20 popular programming languages including Python, Java, C++, JavaScript, TypeScript, Go, Ruby, Swift, and Rust."
    },
    {
      question: "Can I collaborate with other developers?",
      answer: "Absolutely. Our 'Live Collaboration' feature allows you to invite friends or mentors to your coding session."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-frontier-black" id="faq">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <div className="mb-16 border-l-2 border-primary pl-6">
          <span className="text-primary font-mono text-xs uppercase block mb-2 font-bold tracking-widest">Documentation</span>
          <h2 className="text-3xl font-serif text-white">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details 
              key={index} 
              className="group bg-frontier-card rounded border border-white/10 open:border-primary/40 transition-all duration-300 overflow-hidden"
              open={openIndex === index}
            >
              <summary 
                className="flex justify-between items-center p-6 cursor-pointer text-gray-200 font-medium font-mono text-sm hover:text-white hover:bg-white/5 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFAQ(index);
                }}
              >
                <span>&gt; {faq.question}</span>
                <span className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                  <span className="material-icons-outlined text-gray-400">expand_more</span>
                </span>
              </summary>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4 mt-2 bg-black/10">
                  {faq.answer}
                </div>
              )}
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;

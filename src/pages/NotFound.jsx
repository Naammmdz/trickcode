import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorContent from '../components/error/ErrorContent';
import ErrorTerminal from '../components/error/ErrorTerminal';

const NotFound = () => {
    return (
        <div className="bg-frontier-black text-gray-200 antialiased font-sans flex flex-col min-h-screen selection:bg-sharp-yellow/40 selection:text-black overflow-hidden relative">
            <style>{`
        .grid-bg {
            background-size: 4rem 4rem;
            mask-image: linear-gradient(to bottom, transparent, 5%, black, 95%, transparent);
            -webkit-mask-image: linear-gradient(to bottom, transparent, 5%, black, 95%, transparent);
        }
      `}</style>

            {/* Background Elements */}
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] grid-bg"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/5 rounded-full blur-[120px] opacity-20"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sharp-yellow/5 rounded-full blur-[120px] opacity-20"></div>
            </div>

            <Navbar simple={true} />

            <main className="flex-grow flex flex-col items-center justify-center relative z-10 px-6 py-12">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
                    <div className="order-2 lg:order-1">
                        <ErrorContent />
                    </div>
                    <div className="order-1 lg:order-2 relative">
                        <ErrorTerminal />
                        <div className="absolute -z-10 -top-4 -right-4 w-24 h-24 border-t border-r border-neon-blue/20 rounded-tr-xl"></div>
                        <div className="absolute -z-10 -bottom-4 -left-4 w-24 h-24 border-b border-l border-sharp-yellow/20 rounded-bl-xl"></div>
                    </div>
                </div>
            </main>

            <Footer simple={true} />
        </div>
    );
};

export default NotFound;

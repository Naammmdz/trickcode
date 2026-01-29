import React from 'react';

const ErrorTerminal = () => {
    return (
        <div className="relative bg-frontier-card border border-white/10 rounded-lg p-1 overflow-hidden group shadow-2xl h-full">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sharp-yellow to-transparent opacity-50"></div>

            <div className="bg-[#0A0A0A] rounded p-6 font-mono text-xs md:text-sm relative overflow-hidden min-h-[300px] h-full flex flex-col">
                <style>{`
          .scanline {
            background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3) 51%);
            background-size: 100% 4px;
          }
        `}</style>
                <div className="absolute inset-0 scanline opacity-20 pointer-events-none"></div>

                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px] font-bold">Terminal Output</span>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                </div>

                <div className="space-y-3 font-mono flex-grow">
                    <div className="flex gap-2 text-gray-400">
                        <span className="text-gray-600 select-none w-6 text-right">01</span>
                        <span>initiating_request(GET /unknown/path)...</span>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                        <span className="text-gray-600 select-none w-6 text-right">02</span>
                        <span>resolving_host... <span className="text-terminal-green">[OK]</span></span>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                        <span className="text-gray-600 select-none w-6 text-right">03</span>
                        <span>handshake_protocol... <span className="text-terminal-green">[OK]</span></span>
                    </div>
                    <div className="flex gap-2 text-gray-400">
                        <span className="text-gray-600 select-none w-6 text-right">04</span>
                        <span className="text-neon-blue">scanning_directories...</span>
                    </div>
                    <div className="flex gap-2 text-red-400 mt-2">
                        <span className="text-gray-600 select-none w-6 text-right">05</span>
                        <span className="bg-red-500/10 px-1 border border-red-500/20">ERROR: 404_NOT_FOUND</span>
                    </div>
                    <div className="flex gap-2 text-gray-500 pl-8 text-[10px] leading-tight opacity-70">
                        <span>at Route.match (/app/routes/index.js:42:12)<br />at Layer.handle [as handle_request] (/node_modules/express/lib/router/layer.js:95:5)</span>
                    </div>
                    <div className="flex gap-2 text-sharp-yellow mt-4">
                        <span className="text-gray-600 select-none w-6 text-right">06</span>
                        <span>_waiting_for_input</span>
                        <span className="w-2 h-4 bg-sharp-yellow animate-pulse"></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorTerminal;

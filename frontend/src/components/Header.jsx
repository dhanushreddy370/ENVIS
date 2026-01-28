import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-50 pointer-events-none">
            {/* Logo Area */}
            <div className="flex items-center gap-3 glass-panel px-4 py-2 rounded-full pointer-events-auto">
                <div className="w-8 h-8 rounded-full bg-blue-500 animate-pulse"></div>
                <h1 className="text-xl font-bold tracking-widest font-mono text-blue-100">E.N.V.I.S.</h1>
            </div>

            {/* Settings Area */}
            <Link to="/settings" className="pointer-events-auto group">
                <div className="glass-panel p-3 rounded-full hover:bg-white/10 transition-colors">
                    <Settings className="w-6 h-6 text-blue-200 group-hover:rotate-90 transition-transform duration-700" />
                </div>
            </Link>
        </header>
    );
};

export default Header;

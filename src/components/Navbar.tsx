import { Link, useLocation } from 'react-router-dom';
import { Coffee, Settings, ShoppingBag, LayoutDashboard } from 'lucide-react';
import { cn } from '../lib/utils';
import { auth, loginWithGoogle } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Navbar() {
  const [user] = useAuthState(auth);
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-black/5 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
            <Coffee size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-brand">Oolong Tea</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to={isAdminPage ? "/" : "/admin"}
            className={cn(
              "p-2 rounded-xl transition-all flex items-center gap-2 font-medium px-4",
              isAdminPage 
                ? "bg-brand/10 text-brand" 
                : "text-gray-500 hover:bg-gray-100"
            )}
          >
            {isAdminPage ? <ShoppingBag size={20} /> : <LayoutDashboard size={20} />}
            <span className="hidden sm:inline">{isAdminPage ? "Ordering" : "Dashboard"}</span>
          </Link>
          
          {user ? (
            <div className="flex items-center gap-3 bg-gray-100 p-1 px-3 rounded-full">
              <span className="text-sm font-medium hidden sm:inline">{user.displayName || 'Admin'}</span>
              <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} className="w-8 h-8 rounded-full border border-white" alt="profile" />
            </div>
          ) : (
            <button 
              onClick={() => loginWithGoogle()}
              className="bg-brand text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

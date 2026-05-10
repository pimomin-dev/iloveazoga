import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useOrders } from '../hooks/useFirebase';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Clock, CheckCircle2, AlertCircle, XCircle, LayoutDashboard, Search, ShoppingBag } from 'lucide-react';
import { OrderStatus } from '../types';
import { cn } from '../lib/utils';

const STATUS_CONFIG: Record<OrderStatus, { icon: any, color: string, bg: string, label: string }> = {
  pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
  preparing: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Preparing' },
  completed: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50', label: 'Completed' },
  cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
};

export default function Admin() {
  const [user] = useAuthState(auth);
  const { orders, loading, updateOrderStatus } = useOrders();
  const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  // Access control
  const isAdmin = user?.email === 'pimo.min@gmail.com'; 

  if (!user) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <LayoutDashboard size={64} className="text-gray-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Admin Only</h2>
        <p className="text-gray-500 mt-2 max-w-sm">Please log in with an authorized account to access the dashboard.</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center p-4">
        <XCircle size={64} className="text-red-200 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2">Your account ({user.email}) does not have admin privileges.</p>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || 
                         o.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 font-medium mt-1">Manage orders and store status</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(['all', 'pending', 'preparing', 'completed', 'cancelled'] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all",
                filter === s ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-white text-gray-500 border border-black/5 hover:bg-gray-50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </header>

      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
        <Search size={20} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search customer name or order ID..."
          className="flex-1 bg-transparent border-none outline-none font-medium text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-24 flex justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-4 border-brand border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map(order => {
              const config = STATUS_CONFIG[order.status];
              const Icon = config.icon;

              return (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl border border-black/5 shadow-xl shadow-black/[0.02] flex flex-col overflow-hidden"
                >
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        <h3 className="text-xl font-black text-gray-900">{order.customerName}</h3>
                      </div>
                      <div className={cn("px-3 py-1 rounded-full flex items-center gap-1.5", config.bg, config.color)}>
                        <Icon size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{config.label}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                       {order.items.map((item, idx) => (
                         <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                               <span className="font-bold text-gray-900">{item.quantity}x</span> {item.name} ({item.size})
                            </span>
                            <span className="text-gray-400 text-xs">{item.ice}/{item.sugar}</span>
                         </div>
                       ))}
                    </div>

                    <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-end">
                      <div className="text-[10px] text-gray-400 font-bold uppercase">
                        {order.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-lg font-black text-brand">${order.total}</div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 grid grid-cols-2 gap-2">
                    {order.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                          className="col-span-2 bg-brand text-white py-2 rounded-xl text-xs font-bold hover:opacity-90"
                        >
                          Start Preparing
                        </button>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="bg-white text-red-500 border border-red-100 py-2 rounded-xl text-xs font-bold hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {order.status === 'preparing' && (
                      <>
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="col-span-2 bg-green-500 text-white py-2 rounded-xl text-xs font-bold hover:opacity-90"
                        >
                          Mark Done
                        </button>
                      </>
                    )}
                    {order.status === 'completed' && (
                       <button className="col-span-2 bg-gray-100 text-gray-400 py-2 rounded-xl text-xs font-bold cursor-default" disabled>
                          Fulfilled
                       </button>
                    )}
                    {order.status === 'cancelled' && (
                       <button className="col-span-2 bg-gray-100 text-gray-400 py-2 rounded-xl text-xs font-bold cursor-default" disabled>
                          Cancelled
                       </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredOrders.length === 0 && (
        <div className="bg-white/50 backdrop-blur-sm border border-dashed border-gray-200 rounded-[40px] py-24 flex flex-col items-center justify-center text-center">
           <ShoppingBag size={48} className="text-gray-200 mb-4" />
           <h3 className="text-lg font-bold text-gray-400">No orders found</h3>
        </div>
      )}
    </div>
  );
}

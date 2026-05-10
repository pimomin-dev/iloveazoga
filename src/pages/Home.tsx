import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useFirebase } from '../hooks/useFirebase';
import DrinkCard from '../components/DrinkCard';
import OrderModal from '../components/OrderModal';
import { Product, OrderItem } from '../types';
import { ShoppingCart, ShoppingBag, Trash2, Send, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Home() {
  const { categories, products, toppings, loading, placeOrder, seed } = useFirebase();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customerName, setCustomerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.categoryId === activeCategory);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (item: OrderItem) => {
    setCart(prev => [...prev, item]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const handleSubmitOrder = async () => {
    if (!customerName) return alert('Please enter your name');
    if (cart.length === 0) return;

    setIsSubmitting(true);
    try {
      await placeOrder({
        items: cart,
        total,
        status: 'pending',
        customerName,
      });
      setCart([]);
      setCustomerName('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Order error:', error);
      alert('Failed to place order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full"
      />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
      {/* Menu Section */}
      <div className="flex-1 space-y-8">
        <header className="space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold tracking-tight">Menu</h1>
            {products.length === 0 && (
              <button onClick={seed} className="text-xs text-gray-400 hover:text-brand underline">
                Initialize Data
              </button>
            )}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                "px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all",
                activeCategory === 'all' ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-white text-gray-500 hover:bg-gray-100"
              )}
            >
              All Drinks
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all",
                  activeCategory === cat.id ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-white text-gray-500 hover:bg-gray-100"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </header>

        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map(product => (
              <DrinkCard key={product.id} product={product} onSelect={setSelectedProduct} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Cart Section */}
      <aside className="w-full lg:w-96 space-y-6 lg:sticky lg:top-24 h-fit">
        <div className="bg-white rounded-[32px] p-6 shadow-xl shadow-black/5 border border-black/5 flex flex-col min-h-[400px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h2 className="font-bold text-xl">Your Order</h2>
              <p className="text-xs text-gray-400 font-medium">{cart.length} items selected</p>
            </div>
          </div>

          <div className="flex-1 space-y-4 max-h-[400px] overflow-y-auto mb-6 pr-2 scrollbar-thin scrollbar-thumb-gray-200">
            {cart.map(item => (
              <motion.div
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={item.id}
                className="group flex justify-between items-center p-3 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <div>
                  <h4 className="font-bold text-sm">{item.name} <span className="text-gray-400 font-normal">({item.size})</span></h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {item.ice} / {item.sugar} {item.toppings.length > 0 && `+ ${item.toppings.join(', ')}`}
                  </p>
                  <p className="text-xs font-bold text-brand mt-1">${item.price}</p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 opacity-0 group-hover:opacity-100 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}

            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                <ShoppingBag size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">Cart is empty</p>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-gray-400 pl-1">Customer Name</label>
              <input
                type="text"
                placeholder="Ex: John Doe"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all font-medium text-sm"
              />
            </div>

            <div className="flex justify-between items-end px-2">
              <span className="text-gray-400 font-bold uppercase text-xs">Total</span>
              <span className="text-3xl font-black text-brand">${total}</span>
            </div>

            <button
              disabled={cart.length === 0 || !customerName || isSubmitting}
              onClick={handleSubmitOrder}
              className="w-full bg-brand text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all shadow-lg shadow-brand/20 mt-4"
            >
              {isSubmitting ? (
                 <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
              ) : (
                <>Place Order <Send size={18} /></>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Popups */}
      <OrderModal 
        product={selectedProduct} 
        toppings={toppings} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={handleAddToCart}
      />

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-[40px] p-12 text-center shadow-2xl space-y-6">
              <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[32px] flex items-center justify-center mx-auto">
                <CheckCircle2 size={64} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900">Ordered!</h2>
                <p className="text-gray-500 font-medium">Your drink will be ready soon.</p>
              </div>
              <button 
                onClick={() => setShowSuccess(false)}
                className="bg-gray-100 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight } from 'lucide-react';
import { Product, Topping, OrderItem } from '../types';
import { cn } from '../lib/utils';

interface OrderModalProps {
  product: Product | null;
  toppings: Topping[];
  onClose: () => void;
  onAddToCart: (item: OrderItem) => void;
}

const ICE_LEVELS = ['正常冰', '少冰', '半冰', '微冰', '去冰'];
const SUGAR_LEVELS = ['正常糖', '七分糖', '五分糖', '三分糖', '一分糖', '無糖'];

export default function OrderModal({ product, toppings, onClose, onAddToCart }: OrderModalProps) {
  const [size, setSize] = useState<'M' | 'L'>('M');
  const [ice, setIce] = useState('正常冰');
  const [sugar, setSugar] = useState('五分糖');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const totalPrice = (size === 'M' ? product.priceM : product.priceL) + 
    selectedToppings.length * 10; // Simple flat rate for mappings in this shop

  const handleAddToCart = () => {
    onAddToCart({
      id: Math.random().toString(36).substr(2, 9),
      name: product.name,
      size,
      ice,
      sugar,
      toppings: selectedToppings,
      price: totalPrice,
      quantity
    });
    onClose();
  };

  const toggleTopping = (name: string) => {
    setSelectedToppings(prev => 
      prev.includes(name) ? prev.filter(t => t !== name) : [...prev, name]
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white w-full max-w-lg rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
              <p className="text-gray-400 font-medium">{product.nameEn}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-8">
            {/* Size */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Size</h4>
              <div className="grid grid-cols-2 gap-3">
                {(['M', 'L'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      "py-3 rounded-2xl border-2 transition-all flex flex-col items-center",
                      size === s ? "border-brand bg-brand/5 text-brand" : "border-gray-100 text-gray-500 hover:border-gray-300"
                    )}
                  >
                    <span className="font-bold text-lg">{s}</span>
                    <span className="text-sm">${s === 'M' ? product.priceM : product.priceL}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Sugar */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Sugar Level</h4>
              <div className="grid grid-cols-3 gap-2">
                {SUGAR_LEVELS.map(s => (
                  <button
                    key={s}
                    onClick={() => setSugar(s)}
                    className={cn(
                      "py-2 px-1 rounded-xl text-xs font-medium border-2 transition-all",
                      sugar === s ? "border-brand bg-brand/5 text-brand" : "border-gray-100 text-gray-500"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </section>

            {/* Ice */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Ice Level</h4>
              <div className="grid grid-cols-3 gap-2">
                {ICE_LEVELS.map(i => (
                  <button
                    key={i}
                    onClick={() => setIce(i)}
                    className={cn(
                      "py-2 px-1 rounded-xl text-xs font-medium border-2 transition-all",
                      ice === i ? "border-brand bg-brand/5 text-brand" : "border-gray-100 text-gray-500"
                    )}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </section>

            {/* Toppings */}
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Toppings (+$10 each)</h4>
              <div className="flex flex-wrap gap-2">
                {toppings.map(t => (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t.name)}
                    className={cn(
                      "py-2 px-4 rounded-full text-sm font-medium border-2 transition-all",
                      selectedToppings.includes(t.name) ? "border-brand bg-brand/5 text-brand" : "border-gray-100 text-gray-500"
                    )}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4 items-center">
            <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-2 h-14">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl hover:bg-gray-100"
              >
                -
              </button>
              <span className="font-bold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xl hover:bg-gray-100"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-brand text-white h-14 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
            >
              Add to Order <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

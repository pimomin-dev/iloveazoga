import { motion } from 'motion/react';
import { Product } from '../types';
import { Plus } from 'lucide-react';

interface DrinkCardProps {
  key?: string;
  product: Product;
  onSelect: (product: Product) => void;
}

export default function DrinkCard({ product, onSelect }: DrinkCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white p-4 rounded-2xl shadow-sm border border-black/5 flex flex-col justify-between group cursor-pointer"
      onClick={() => onSelect(product)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-brand transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
            {product.nameEn}
          </p>
        </div>
        {product.isRecommended && (
          <span className="text-[10px] bg-brand/10 text-brand px-2 py-0.5 rounded-full font-bold uppercase">
            Rec
          </span>
        )}
      </div>

      <div className="flex justify-between items-end mt-4">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Medium</span>
            <span className="font-bold text-brand">${product.priceM}</span>
          </div>
          {product.priceL > 0 && (
            <div className="flex flex-col border-l border-black/10 pl-4">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Large</span>
              <span className="font-bold text-brand">${product.priceL}</span>
            </div>
          )}
        </div>
        
        <div className="bg-brand text-white p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-brand/20">
          <Plus size={18} />
        </div>
      </div>
    </motion.div>
  );
}

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Product } from '@/types';
import confetti from 'canvas-confetti';
import { playSoftTick } from '@/lib/sound';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: { product: Product; quantity: number }[];
  onRemoveItem: (id: string) => void;
}

export default function CartDrawer({ isOpen, onClose, items, onRemoveItem }: CartDrawerProps) {
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const first = dialog.current?.querySelector<HTMLButtonElement>('button');
    first?.focus();
    const keys = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const controls = dialog.current?.querySelectorAll<HTMLElement>('button, a[href], input, [tabindex="0"]');
      if (!controls?.length) return;
      const firstControl = controls[0], lastControl = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === firstControl) { event.preventDefault(); lastControl.focus(); }
      if (!event.shiftKey && document.activeElement === lastControl) { event.preventDefault(); firstControl.focus(); }
    };
    document.addEventListener('keydown', keys);
    return () => { document.removeEventListener('keydown', keys); previous?.focus({ preventScroll: true }); };
  }, [isOpen, onClose]);
  const subtotal = items.reduce((acc, item) => {
    const numPrice = parseFloat(item.product.price.replace('$', ''));
    return acc + numPrice * item.quantity;
  }, 0);

  const handleCheckout = () => {
    playSoftTick();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD54A', '#4DA6FF', '#FF4FA3', '#C9A6FF', '#FAFAF8'],
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9900] bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            ref={dialog}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            data-lenis-prevent
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[9910] w-full max-w-md bg-[#FDF8F3] shadow-2xl flex flex-col border-l border-[#1A1816]/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#1A1816]/10 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl text-[#1A1816]">Your Curated Ritual</h3>
                <p className="text-xs text-[#1A1816]/60 tracking-wider font-mono uppercase mt-0.5">
                  Complimentary Worldwide White-Glove Courier
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 text-[#1A1816] transition-colors"
                aria-label="Close Bag"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#FFD54A]/20 flex items-center justify-center text-[#1A1816] mb-4">
                    <Sparkles size={24} />
                  </div>
                  <h4 className="font-serif text-lg text-[#1A1816] mb-1">Your ritual is empty</h4>
                  <p className="text-sm text-[#1A1816]/60 max-w-xs">
                    Explore our five signature clinical formulations to begin your skin transformation.
                  </p>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl glass-panel flex items-center space-x-4 border border-[#1A1816]/5"
                  >
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center font-display font-bold text-xs"
                      style={{ backgroundColor: product.bgHex, color: product.textColor }}
                    >
                      {product.colorName.split(' ')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#1A1816] truncate">{product.name}</h4>
                      <p className="text-xs text-[#1A1816]/60 font-mono mt-0.5">
                        Qty: {quantity} • {product.volume}
                      </p>
                      <p className="text-sm font-serif font-medium text-[#1A1816] mt-1">{product.price}</p>
                    </div>
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-2 text-[#1A1816]/40 hover:text-red-500 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[#1A1816]/10 bg-white/40 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-[#1A1816]/70">
                    <span>Subtotal</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#1A1816]/70">
                    <span>Carbon-Neutral Delivery</span>
                    <span className="text-emerald-700 font-medium">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-[#1A1816] pt-2 border-t border-[#1A1816]/10">
                    <span>Total Investment</span>
                    <span className="font-mono">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-full bg-[#1A1816] text-[#FAFAF8] hover:bg-[#FFD54A] hover:text-[#1A1816] text-xs uppercase tracking-[0.25em] font-semibold flex items-center justify-center space-x-2 transition-all shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99]"
                >
                  <span>Acquire Formulations</span>
                  <ArrowRight size={16} />
                </button>

                <div className="flex items-center justify-center space-x-2 text-[11px] text-[#1A1816]/60">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  <span>30-Day Cellular Satisfaction Guarantee</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

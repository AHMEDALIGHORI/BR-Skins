'use client';

import { useState, useCallback } from 'react';
import SmoothScroll from '@/components/ui/SmoothScroll';
import CustomCursor from '@/components/ui/CustomCursor';
import Loader from '@/components/ui/Loader';
import Navbar from '@/components/ui/Navbar';
import CartDrawer from '@/components/ui/CartDrawer';
import HeroSection from '@/components/sections/HeroSection';
import ExplodedSection from '@/components/sections/ExplodedSection';
import IngredientsSection from '@/components/sections/IngredientsSection';
import LiquidPhysicsSection from '@/components/sections/LiquidPhysicsSection';
import ProductShowcaseSection from '@/components/sections/ProductShowcaseSection';
import LifestyleSection from '@/components/sections/LifestyleSection';
import WhyBRSkinsSection from '@/components/sections/WhyBRSkinsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';
import FinalProductSection from '@/components/sections/FinalProductSection';
import Footer from '@/components/sections/Footer';
import { PRODUCTS } from '@/lib/products';
import { Product } from '@/types';

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([
  ]);

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const handleRemoveFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
  }, []);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <SmoothScroll>
      {/* Luxury Brand Custom Cursor */}
      <CustomCursor />

      {/* Cinematic Logo Preloader */}
      <Loader onComplete={() => setLoadingComplete(true)} />

      {/* Persistent Luxury Navigation Header */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Main Experience Flow */}
      <main className="relative w-full bg-[#FDF8F3] overflow-hidden">
        {/* SECTION 1: IMMERSIVE HERO */}
        <HeroSection ready={loadingComplete} />

        {/* SECTION 2: EXPLODED PRODUCT */}
        <ExplodedSection />

        {/* SECTION 3: INGREDIENT UNIVERSE */}
        <IngredientsSection />

        {/* SECTION 4: LIQUID PHYSICS */}
        <LiquidPhysicsSection />

        {/* SECTION 5: PRODUCT SHOWCASE */}
        <ProductShowcaseSection onAddToCart={handleAddToCart} />

        {/* SECTION 6: LIFESTYLE EDITORIAL */}
        <LifestyleSection />

        {/* SECTION 7: WHY BR-SKINS */}
        <WhyBRSkinsSection />

        {/* SECTION 8: TESTIMONIALS */}
        <TestimonialsSection />

        {/* SECTION 9: FINAL PRODUCT & 3D REIMAGINED */}
        <FinalProductSection />
      </main>

      {/* Editorial Luxury Footer */}
      <Footer />

      {/* Slide-out Curated Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
      />
    </SmoothScroll>
  );
}

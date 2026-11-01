'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Check, ShieldCheck, Mail } from 'lucide-react';
import { playSoftTick } from '@/lib/sound';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    playSoftTick();
    setSubscribed(true);
  };

  return (
    <footer className="relative bg-[#1A1816] text-[#FAFAF8] pt-24 pb-12 overflow-hidden">
      {/* Background ambient gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-gradient-to-b from-[#FFD54A]/10 to-transparent pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Top Editorial Banner with Flat-Lay Image */}
        <div className="p-8 md:p-12 rounded-3xl bg-[#23201D] border border-white/10 mb-20 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-lg space-y-4">
            <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#FFD54A]">
              The Vanity Editorial
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-white font-normal">
              Skincare worthy of your vanity and your biology.
            </h3>
            <p className="text-xs md:text-sm text-white/70 font-sans leading-relaxed">
              Join the private BR-Skins Circle for priority allocations, clinical formulation notes, and invitation-only releases.
            </p>

            <form onSubmit={handleSubscribe} className="flex max-w-md pt-2">
              {subscribed ? (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono py-3">
                  <Check size={16} />
                  <span>Welcome to the BR-Skins Circle. Invitation dispatched.</span>
                </div>
              ) : (
                <div className="flex w-full rounded-full bg-white/10 p-1 border border-white/15 focus-within:border-[#FFD54A]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your private email"
                    required
                    className="flex-1 bg-transparent px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none font-mono"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#FFD54A] text-[#121110] text-[11px] font-mono uppercase tracking-widest font-bold hover:bg-white transition-colors"
                  >
                    Join
                  </button>
                </div>
              )}
            </form>
          </div>

          <div className="relative w-full lg:w-80 h-48 rounded-2xl overflow-hidden shadow-2xl shrink-0">
            <Image
              src="/assets/flat-lay.jpg"
              alt="BR-Skins Luxury Flat Lay"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-16 border-b border-white/10 text-xs font-mono">
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold">
              Formulations
            </h4>
            <ul className="space-y-2 text-white/75">
              <li><a href="#section-showcase" className="hover:text-[#FFD54A] transition-colors">Vitamin C Elixir</a></li>
              <li><a href="#section-showcase" className="hover:text-[#4DA6FF] transition-colors">Hydra Boost Quench</a></li>
              <li><a href="#section-showcase" className="hover:text-[#FF4FA3] transition-colors">Retinol Night Matrix</a></li>
              <li><a href="#section-showcase" className="hover:text-[#C9A6FF] transition-colors">Velvet Cloud Cleanser</a></li>
              <li><a href="#section-showcase" className="hover:text-[#FAFAF8] transition-colors">Silk SPF 50+ Shield</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold">
              The Science
            </h4>
            <ul className="space-y-2 text-white/75">
              <li><a href="#section-exploded" className="hover:text-white transition-colors">Deconstructed Architecture</a></li>
              <li><a href="#section-ingredients" className="hover:text-white transition-colors">Bio-Active Fermentation</a></li>
              <li><a href="#section-liquid" className="hover:text-white transition-colors">Rheological Fluidics</a></li>
              <li><a href="#section-lifestyle" className="hover:text-white transition-colors">Clinical Study Data</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold">
              Philosophy
            </h4>
            <ul className="space-y-2 text-white/75">
              <li><span className="text-white/60">Bespoke Glassmaking</span></li>
              <li><span className="text-white/60">Zero Animal Testing</span></li>
              <li><span className="text-white/60">Carbon-Neutral Dosing</span></li>
              <li><span className="text-white/60">Medical Grade Purity</span></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.3em] text-white/40 font-bold">
              Concierge
            </h4>
            <ul className="space-y-2 text-white/75">
              <li><span className="text-white/60">Direct Dermatologist Chat</span></li>
              <li><span className="text-white/60">White-Glove Shipping</span></li>
              <li><span className="text-white/60">Bespoke Gifting</span></li>
              <li><span className="text-white/60">Press & Editorial Inquiries</span></li>
            </ul>
          </div>
        </div>

        {/* Monumental Brand Typography */}
        <div className="pt-16 pb-12 flex flex-col items-center justify-center text-center">
          <span className="font-display text-6xl sm:text-8xl md:text-9xl lg:text-[140px] font-bold tracking-[0.2em] text-white/10 select-none hover:text-white/20 transition-colors">
            BR-SKINS
          </span>
          <p className="text-[10px] uppercase font-mono tracking-[0.4em] text-white/40 -mt-2">
            Haute Skincare & Dermatological Research • Paris • New York • Tokyo
          </p>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-white/40 gap-4">
          <p>© 2026 BR-Skins Laboratoire Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Privacy Charter</span>
            <span>Terms of Formulation</span>
            <span>Security & Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

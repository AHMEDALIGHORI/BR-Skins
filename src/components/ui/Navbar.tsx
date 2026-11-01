'use client';
import { useEffect, useState } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
const links = [
  ['Formula', '#section-hero'], ['Craft', '#section-exploded'], ['Ingredients', '#section-ingredients'],
  ['Collection', '#section-showcase'], ['Our world', '#section-lifestyle'],
];
export default function Navbar({ onOpenCart, cartCount }: { onOpenCart: () => void; cartCount: number }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', escape); return () => window.removeEventListener('keydown', escape);
  }, []);
  return <header className="site-header">
    <a className="brand-wordmark" href="#section-hero" aria-label="BR-Skins home">BR-SKINS<small>THE DAILY RITUAL</small></a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(([name, href]) => <a key={href} href={href}>{name}</a>)}</nav>
    <div className="header-actions"><button aria-label={`Shopping Bag (${cartCount} items)`} onClick={onOpenCart}><ShoppingBag size={18} strokeWidth={1.4} />{cartCount > 0 && <span>{cartCount}</span>}</button>
      <a href="#section-showcase" className="header-shop">Shop Collection ↗</a>
      <button className="mobile-menu-button" aria-label="Toggle Menu" aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={21} /> : <Menu size={21} />}</button>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-navigation" aria-label="Mobile navigation">{links.map(([name, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{name}<span>↗</span></a>)}</nav>}
  </header>;
}

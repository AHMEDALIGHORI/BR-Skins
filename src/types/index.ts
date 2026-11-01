export interface Product {
  id: string;
  name: string;
  tagline: string;
  colorName: string;
  hex: string;
  bgHex: string;
  textColor: string;
  price: string;
  volume: string;
  finish: string;
  description: string;
  keyActives: string[];
  benefits: string[];
  clinicalResult: string;
  texture: string;
  scent: string;
  image: string;
}

export interface Ingredient {
  name: string;
  category: string;
  color: string;
  concentration: string;
  origin: string;
  role: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  publication: string;
  location: string;
  rating: number;
}

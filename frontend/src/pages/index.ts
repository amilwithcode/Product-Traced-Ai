export interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
    store: string;
  }
  
  export interface AIAnalysis {
    translatedDescription: string;
    alternatives: Product[];
    confidence: number;
  }
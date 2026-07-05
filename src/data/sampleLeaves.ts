export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  colorClass: string;
  desc: string;
  visualPattern: string; // SVG-like or CSS background representation
}

export const sampleLeaves: SampleLeaf[] = [
  {
    id: "rice_blast",
    name: "Leaf with spindle-shaped spots",
    crop: "Rice / Paddy",
    colorClass: "from-amber-100 to-amber-200 border-amber-400",
    desc: "Spindle spots, grayish center with reddish-brown margins",
    visualPattern: "rice-blast"
  },
  {
    id: "tomato_early_blight",
    name: "Leaf with target-like brown circles",
    crop: "Tomato",
    colorClass: "from-yellow-100 to-yellow-200 border-yellow-400",
    desc: "Concentric black-brown ring lesions on older leaves",
    visualPattern: "early-blight"
  },
  {
    id: "cotton_blight",
    name: "Water-soaked dark angular spots",
    crop: "Cotton",
    colorClass: "from-zinc-100 to-zinc-200 border-zinc-400",
    desc: "Angular spots bounded by veins, turning black/brown",
    visualPattern: "cotton-blight"
  },
  {
    id: "healthy_wheat",
    name: "Lush green disease-free leaf",
    crop: "Wheat",
    colorClass: "from-emerald-100 to-emerald-200 border-emerald-400",
    desc: "Perfect green uniform texture, zero active lesions",
    visualPattern: "healthy"
  }
];

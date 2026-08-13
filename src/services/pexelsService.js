// Pexels API Service Layer
// Manages live API requests and handles curated fallback mode when no API key is set.

const API_KEY_STORAGE_KEY = 'pexels_api_key_v1';

// Curator Mode Data: High-quality real Pexels photos for offline/fallback mode
const MOCK_WALLPAPERS = [
  // --- LANDSCAPES (Desktop Wallpapers) ---
  {
    id: 2662116,
    width: 3000,
    height: 2000,
    url: "https://www.pexels.com/photo/scenic-view-of-moraine-lake-2662116/",
    photographer: "Jaime Reimer",
    photographer_url: "https://www.pexels.com/@jaimereimer",
    avg_color: "#376c8c",
    alt: "Scenic view of Moraine Lake under blue skies",
    category: "nature",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg",
      large2x: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 1169754,
    width: 5472,
    height: 3648,
    url: "https://www.pexels.com/photo/stars-in-space-1169754/",
    photographer: "Felix Mittermeier",
    photographer_url: "https://www.pexels.com/@felixmittermeier",
    avg_color: "#1c142c",
    alt: "Stars in night sky cosmos",
    category: "space",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg",
      large2x: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 2325443,
    width: 6000,
    height: 4000,
    url: "https://www.pexels.com/photo/green-mountains-under-white-clouds-2325443/",
    photographer: "Sven M",
    photographer_url: "https://www.pexels.com/@sven",
    avg_color: "#4a5357",
    alt: "Green mountains under white clouds nature landscape",
    category: "nature",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/2325443/pexels-photo-2325443.jpeg",
      large2x: "https://images.pexels.com/photos/2325443/pexels-photo-2325443.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/2325443/pexels-photo-2325443.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/2325443/pexels-photo-2325443.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/2325443/pexels-photo-2325443.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/2325443/pexels-photo-2325443.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/2325443/pexels-photo-2325443.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/2325443/pexels-photo-2325443.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 3293148,
    width: 3840,
    height: 2160,
    url: "https://www.pexels.com/photo/minimalist-graphic-wave-lines-3293148/",
    photographer: "Rene Asmussen",
    photographer_url: "https://www.pexels.com/@reneasmussen",
    avg_color: "#181818",
    alt: "Abstract wave pattern background minimalist",
    category: "minimalist",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg",
      large2x: "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/3293148/pexels-photo-3293148.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 1629236,
    width: 6000,
    height: 4000,
    url: "https://www.pexels.com/photo/pink-and-blue-abstract-painting-1629236/",
    photographer: "Jannis Lucas",
    photographer_url: "https://www.pexels.com/@jannis-lucas-204128",
    avg_color: "#6c4d7f",
    alt: "Abstract colorful painting fluid ink wave art",
    category: "abstract",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg",
      large2x: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1629236/pexels-photo-1629236.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 323780,
    width: 3888,
    height: 2592,
    url: "https://www.pexels.com/photo/concrete-and-glass-building-architectural-design-323780/",
    photographer: "Pexels User",
    photographer_url: "https://www.pexels.com",
    avg_color: "#8ca0a8",
    alt: "Modern architecture minimalist concrete and glass building facade",
    category: "architecture",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
      large2x: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 1770809,
    width: 6000,
    height: 4000,
    url: "https://www.pexels.com/photo/pine-trees-1770809/",
    photographer: "Luis del Río",
    photographer_url: "https://www.pexels.com/@luisdelrio",
    avg_color: "#2c3b2e",
    alt: "Misty pine forest landscape mountain peak",
    category: "nature",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg",
      large2x: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 1274260,
    width: 6000,
    height: 4000,
    url: "https://www.pexels.com/photo/purple-nebula-in-space-1274260/",
    photographer: "Jeremy Thomas",
    photographer_url: "https://www.pexels.com/@jeremythomas",
    avg_color: "#1e1430",
    alt: "Deep space purple nebula galaxy star cluster",
    category: "space",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg",
      large2x: "https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1274260/pexels-photo-1274260.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 1612351,
    width: 4000,
    height: 6000,
    url: "https://www.pexels.com/photo/cyberpunk-alley-in-tokyo-1612351/",
    photographer: "Alex Knight",
    photographer_url: "https://www.pexels.com/@alexknight",
    avg_color: "#1c1d24",
    alt: "Cyberpunk neon street alley in Tokyo at night with signs",
    category: "cyberpunk",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg",
      large2x: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },
  {
    id: 1659438,
    width: 4896,
    height: 3264,
    url: "https://www.pexels.com/photo/architectural-design-of-a-futuristic-building-1659438/",
    photographer: "Sven M",
    photographer_url: "https://www.pexels.com/@sven",
    avg_color: "#b0b4b8",
    alt: "Futuristic architecture design steel modern building facade",
    category: "architecture",
    orientation: "landscape",
    src: {
      original: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg",
      large2x: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280"
    }
  },

  // --- PORTRAITS (Mobile Wallpapers) ---
  {
    id: 3573351,
    width: 3000,
    height: 4500,
    url: "https://www.pexels.com/photo/pine-trees-covered-with-fog-3573351/",
    photographer: "Luis del Río",
    photographer_url: "https://www.pexels.com/@luisdelrio",
    avg_color: "#1d261b",
    alt: "Foggy pine trees forest path green mood portrait",
    category: "nature",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png",
      large2x: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/3573351/pexels-photo-3573351.png?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 3601425,
    width: 3264,
    height: 4896,
    url: "https://www.pexels.com/photo/milky-way-galaxy-night-sky-3601425/",
    photographer: "Felix Mittermeier",
    photographer_url: "https://www.pexels.com/@felixmittermeier",
    avg_color: "#120e24",
    alt: "Stunning starry milky way galaxy night sky portrait",
    category: "space",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg",
      large2x: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 2739013,
    width: 3264,
    height: 4896,
    url: "https://www.pexels.com/photo/city-street-with-neon-lights-2739013/",
    photographer: "Sven M",
    photographer_url: "https://www.pexels.com/@sven",
    avg_color: "#1b1424",
    alt: "Rainy cyberpunk city street at night illuminated by purple and blue neon lights",
    category: "cyberpunk",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/2739013/pexels-photo-2739013.jpeg",
      large2x: "https://images.pexels.com/photos/2739013/pexels-photo-2739013.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/2739013/pexels-photo-2739013.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/2739013/pexels-photo-2739013.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/2739013/pexels-photo-2739013.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/2739013/pexels-photo-2739013.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/2739013/pexels-photo-2739013.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/2739013/pexels-photo-2739013.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 1903702,
    width: 3264,
    height: 4896,
    url: "https://www.pexels.com/photo/sand-dunes-under-sky-1903702/",
    photographer: "Jannis Lucas",
    photographer_url: "https://www.pexels.com/@jannis-lucas-204128",
    avg_color: "#bba895",
    alt: "Minimalist sand dunes ripples under soft sky aesthetic desert portrait",
    category: "minimalist",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg",
      large2x: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 2088205,
    width: 3744,
    height: 5616,
    url: "https://www.pexels.com/photo/colorful-acrylic-paint-swirls-2088205/",
    photographer: "Joel Filipe",
    photographer_url: "https://www.pexels.com/@joelfilipe",
    avg_color: "#4a7a8d",
    alt: "Abstract colorful acrylic paint swirls background fluid art portrait",
    category: "abstract",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg",
      large2x: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/2088205/pexels-photo-2088205.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 15857475,
    width: 4000,
    height: 6000,
    url: "https://www.pexels.com/photo/spiral-concrete-staircase-looking-down-15857475/",
    photographer: "Rene Asmussen",
    photographer_url: "https://www.pexels.com/@reneasmussen",
    avg_color: "#2c2c2c",
    alt: "Abstract bottom-up view of spiral concrete staircase design minimal portrait",
    category: "architecture",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/15857475/pexels-photo-15857475.jpeg",
      large2x: "https://images.pexels.com/photos/15857475/pexels-photo-15857475.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/15857475/pexels-photo-15857475.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/15857475/pexels-photo-15857475.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/15857475/pexels-photo-15857475.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/15857475/pexels-photo-15857475.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/15857475/pexels-photo-15857475.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/15857475/pexels-photo-15857475.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 15286,
    width: 2500,
    height: 3750,
    url: "https://www.pexels.com/photo/river-flowing-in-between-green-leafed-trees-15286/",
    photographer: "Luis del Río",
    photographer_url: "https://www.pexels.com/@luisdelrio",
    avg_color: "#283424",
    alt: "Green forest stream river flowing rocks portrait",
    category: "nature",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/15286/pexels-photo.jpg",
      large2x: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/15286/pexels-photo.jpg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 1252869,
    width: 3000,
    height: 4000,
    url: "https://www.pexels.com/photo/astronaut-in-spacesuit-floating-in-space-1252869/",
    photographer: "Albert Dera",
    photographer_url: "https://www.pexels.com/@albertdera",
    avg_color: "#141724",
    alt: "Astronaut in suit floating in open space nebula background portrait",
    category: "space",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg",
      large2x: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1252869/pexels-photo-1252869.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 1486222,
    width: 3264,
    height: 4896,
    url: "https://www.pexels.com/photo/city-with-futuristic-buildings-1486222/",
    photographer: "Stefan K",
    photographer_url: "https://www.pexels.com/@stefank",
    avg_color: "#180d24",
    alt: "Cyberpunk cityscape neon lit highrise buildings at dusk portrait",
    category: "cyberpunk",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg",
      large2x: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  },
  {
    id: 35069659,
    width: 3072,
    height: 3678,
    url: "https://www.pexels.com/photo/mysterious-illuminated-arch-35069659/",
    photographer: "Albert Dera",
    photographer_url: "https://www.pexels.com/@albertdera",
    avg_color: "#13141f",
    alt: "Sleek futuristic neon amoled landscape portal design",
    category: "cyberpunk",
    orientation: "portrait",
    src: {
      original: "https://images.pexels.com/photos/35069659/pexels-photo-35069659.jpeg",
      large2x: "https://images.pexels.com/photos/35069659/pexels-photo-35069659.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
      large: "https://images.pexels.com/photos/35069659/pexels-photo-35069659.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
      medium: "https://images.pexels.com/photos/35069659/pexels-photo-35069659.jpeg?auto=compress&cs=tinysrgb&h=350",
      small: "https://images.pexels.com/photos/35069659/pexels-photo-35069659.jpeg?auto=compress&cs=tinysrgb&h=130",
      portrait: "https://images.pexels.com/photos/35069659/pexels-photo-35069659.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
      landscape: "https://images.pexels.com/photos/35069659/pexels-photo-35069659.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
      tiny: "https://images.pexels.com/photos/35069659/pexels-photo-35069659.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=135"
    }
  }
];

// Helper to fetch keys
export const getApiKey = () => {
  return localStorage.getItem(API_KEY_STORAGE_KEY) || 'ZuwTjZJPnnSOvzzPyFpyKAlnagehjwUPujguBgz3b6h6G65RjTL2sttn';
};

export const setApiKey = (key) => {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
};

export const hasApiKey = () => {
  return !!getApiKey();
};

// Fetch wrapper for Pexels API
const pexelsFetch = async (endpoint, params = {}) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API key is not configured.');
  }

  const url = new URL(`https://api.pexels.com/v1/${endpoint}`);
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Invalid Pexels API key. Please check your credentials.');
    }
    throw new Error(`Pexels API Error: ${response.statusText} (${response.status})`);
  }

  return response.json();
};

// Main search/curated access
export const getWallpapers = async ({ category = '', query = '', orientation = 'landscape', page = 1, perPage = 16 } = {}) => {
  const apiKey = getApiKey();
  
  // 1. OFFLINE / CURATOR FALLBACK MODE
  if (!apiKey) {
    // Filter our static mock data
    let results = MOCK_WALLPAPERS.filter(item => item.orientation === orientation);

    const activeFilter = query.trim().toLowerCase() || category.toLowerCase();
    
    if (activeFilter) {
      results = results.filter(item => {
        const matchesCategory = item.category.toLowerCase() === activeFilter;
        const matchesText = item.alt.toLowerCase().includes(activeFilter) || 
                            item.photographer.toLowerCase().includes(activeFilter);
        return matchesCategory || matchesText;
      });
    }

    // Paginate static results
    const startIndex = (page - 1) * perPage;
    const paginated = results.slice(startIndex, startIndex + perPage);

    return {
      photos: paginated,
      page: page,
      per_page: perPage,
      total_results: results.length,
      next_page: startIndex + perPage < results.length ? page + 1 : null,
      isMock: true
    };
  }

  // 2. LIVE PEXELS API MODE
  try {
    const activeQuery = query || category || (orientation === 'landscape' ? '4k wallpaper' : 'amoled wallpaper');
    
    // We map custom categories to descriptive terms to get premium photos
    let searchQuery = activeQuery;
    if (category) {
      if (category === 'space') searchQuery = 'space nebula galaxy';
      if (category === 'cyberpunk') searchQuery = 'cyberpunk city neon';
      if (category === 'minimalist') searchQuery = 'minimalist abstract';
      if (category === 'nature') searchQuery = 'landscape nature scenic';
    }

    const data = await pexelsFetch('search', {
      query: searchQuery,
      orientation,
      page,
      per_page: perPage
    });

    return {
      ...data,
      isMock: false
    };
  } catch (error) {
    console.error('Failed fetching live Pexels data, falling back to curated data:', error);
    throw error;
  }
};

/* ===========================================================
   Menus by Colart — item data
   Single source of truth for the directory grid + hero visual.
   Add a new restaurant by adding one object here — nothing else
   needs to change.

   logo: path to the real logo file (same convention as the old
   site: assets/img/{slug}-logo.svg|png). If that file hasn't
   been uploaded yet, the card automatically falls back to the
   generated monogram at assets/img/{slug}-mono.svg — drop the
   real file in with the same name and it swaps in on its own.

   bg: the logo's own native background color (sampled from the
   real artwork), used to fill the avatar circle behind the logo
   so the circle reads as part of the logo itself rather than a
   generic brand-palette swatch.

   accent: brand-palette color used for the card's own UI accents
   (hover ring, node dots, hero connector lines) — unrelated to
   the logo artwork.
=========================================================== */
const MENUS_ITEMS = [
  {
    slug: "alheshmi",
    name: "Al Heshmi",
    nameAr: "",
    category: "Restaurant",
    href: "/alheshmi/",
    logo: "assets/img/alheshmi-logo.png",
    bg: "#0e1010",
    accent: "#642878"
  },
  {
    slug: "nakhakhasa",
    name: "Nakha Khasa",
    nameAr: "نكهة خاصة",
    category: "Restaurant & Café",
    href: "/nakhakhasa/",
    logo: "assets/img/nakhakhasa-logo.png",
    bg: "#ffffff",
    accent: "#8cb43c"
  },
  {
    slug: "chefahmadrestaurant",
    name: "Chef Ahmad Restaurant",
    nameAr: "",
    category: "Restaurant",
    href: "/chefahmadrestaurant/",
    logo: "assets/img/chefahmad-logo.png",
    bg: "#f4f5f0",
    accent: "#c81478"
  },
  {
    slug: "glowbites",
    name: "Glow Bites",
    nameAr: "",
    category: "Bakery & Desserts",
    href: "/glowbites/",
    logo: "assets/img/glowbites-logo.png",
    bg: "#fffaf0",
    accent: "#dcdc3c"
  },
  {
    slug: "abouhamzerestaurant",
    name: "Abou Hamze Restaurant",
    nameAr: "",
    category: "Restaurant",
    href: "/abouhamzerestaurant/",
    logo: "assets/img/abouhamze-logo.png",
    bg: "#650d0c",
    accent: "#50a0b4"
  },
  {
    slug: "abouhamzedelivery",
    name: "Abou Hamze Delivery",
    nameAr: "",
    category: "Delivery",
    href: "/abouhamzedelivery/",
    logo: "assets/img/abouhamze-logo.png",
    bg: "#650d0c",
    accent: "#64a08c"
  },
  {
    slug: "fianchettochesscenter",
    name: "Fianchetto Chess Center",
    nameAr: "",
    category: "Games & Recreation",
    href: "/fianchettochesscenter/",
    logo: "assets/img/fianchetto-logo.png",
    bg: "#ffffff",
    accent: "#4a1d59"
  }
];

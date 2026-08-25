MENUS BY COLART — project scaffold
===================================

This is a working scaffold for menus.colartdigitalmarketingagency.com, built with
your Colart style_6.css as the base. Everything below is real and functional —
the logos and Al Heshmi / Nakha Khasa menu pages are placeholders standing in
until you send the final assets.

FOLDER STRUCTURE
-----------------
index.html                     -> the landing page ("Menus From Colart" + directory grid)
assets/css/style_6.css         -> your original Colart stylesheet, unchanged
assets/css/menus.css           -> new styles for this directory (hero, cards, coming-soon, etc.)
assets/img/                    -> placeholder logo + favicon + 6 restaurant badge logos (SVG)

alheshmi/index.html            -> placeholder "menu pending" page for Al Heshmi
nakhakhasa/index.html          -> placeholder "menu pending" page for Nakha Khasa
chefahmadrestaurant/index.html -> Coming Soon page for Chef Ahmad Restaurant
glowbites/index.html           -> Coming Soon page for Glow Bites
abouhamzerestaurant/index.html -> Coming Soon page for Abou Hamze Restaurant
fianchettochesscenter/index.html -> Coming Soon page for Fianchetto Chess Center

Each folder is named to match the URL you specified, e.g.
menus.colartdigitalmarketingagency.com/alheshmi/  ->  /alheshmi/index.html
Deploy this whole folder to the web root of the menus subdomain and the links work as-is.

WHAT TO SEND ME NEXT (so I can swap in the real thing)
--------------------------------------------------------
1. The "Menus" logo you designed          -> replaces assets/img/menus-logo.svg (used in the header)
2. The favicon you designed                -> replaces assets/img/favicon.svg
3. Al Heshmi's finished menu code          -> replaces the contents of /alheshmi/
4. Nakha Khasa's finished menu code        -> replaces the contents of /nakhakhasa/
5. For EACH of the 4 "coming soon" restaurants, please send:
   - Their logo file (PNG/SVG)
   - Their own style.css
   These currently show placeholder monogram badges + a shared Colart-styled coming-soon
   design. Once I have each restaurant's own logo + style.css, I'll re-skin their Coming
   Soon page in their own brand (as you asked), and drop their full menu in later.

NOTES
-----
- Fonts (Lato via Google Fonts) and icons (Font Awesome via cdnjs) are loaded from CDNs,
  same approach as your main style_6.css assumes — make sure the live subdomain allows
  outbound requests to fonts.googleapis.com / fonts.gstatic.com / cdnjs.cloudflare.com.
- The "Discover All Colart's Services" button on the landing page currently points to
  https://colartdigitalmarketingagency.com — update if your main site URL differs.
- Restaurant cards use root-relative links (/alheshmi/, /glowbites/, etc.), so this must be
  deployed at the root of the menus subdomain (not in a subfolder).

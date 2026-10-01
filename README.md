# Menus by Colart

Directory hub for every restaurant menu Colart Digital Marketing Agency builds, hosted at
`menus.colartdigitalmarketingagency.com`.

## What's in this delivery

This zip contains only the **root-level files that changed** — the redesigned directory page.
It does **not** include the individual restaurant folders (`/alheshmi/`, `/glowbites/`,
`/abouhamzedelivery/`, etc.) — those are untouched and already live in your repo. Drop these
files into the root of the existing `menuscolart-main` repo, alongside those folders, and commit.

```
/
├── index.html              ← new directory page
├── 404.html                ← new branded 404
├── CNAME                   ← menus.colartdigitalmarketingagency.com
├── README.md                ← this file
└── assets/
    ├── css/
    │   └── menus.css        ← standalone stylesheet, brand tokens only
    ├── js/
    │   ├── items.js         ← the restaurant list (edit this to add/remove a menu)
    │   └── menus.js          ← rendering logic (grid, search, chips, hero visual)
    └── img/
        ├── menus-logo.svg       ← full-color M mark (header/hero)
        ├── menus-mark.svg       ← single-color M mark (footer/favicon-sized use)
        ├── favicon.svg
        ├── hero-menu-scan.jpg   ← hero section background photo
        ├── {slug}-logo.png      ← real client logo (shown in the avatar circle + hero visual)
        └── {slug}-mono.svg      ← auto-generated placeholder avatar, used only if a real logo file is missing
```

Your existing restaurant folders keep their own `index.html` / `style.css` / `script.js` exactly
as they are — this delivery only replaces the hub page that links out to them.

## Adding or editing a restaurant

Everything the directory shows is data-driven from one file: **`assets/js/items.js`**. To add a
new menu, add one object to the `MENUS_ITEMS` array:

```js
{
  slug: "newplace",
  name: "New Place",
  nameAr: "",                 // optional, shown under the English name if set
  category: "Restaurant",     // powers the filter chips — reuse an existing category or add a new one
  href: "/newplace/",
  logo: "assets/img/newplace-logo.svg",
  accent: "#642878"           // pick from the brand palette below
}
```

Nothing else needs to change — the card grid, filter chips, search and the hero visual all read
from this array automatically.

## About the avatar photos

Every card now shows its real client logo, cropped square from the files you sent and dropped into
`assets/img/{slug}-logo.png`. The avatar circle's background is set per item (`bg` in `items.js`) to
match that logo's own native background color — not a brand-palette color — so the circle reads as
part of the logo itself (e.g. black for Al Heshmi, white for Nakha Khasa, maroon for Abou Hamze). If
a logo file ever goes missing, the card falls back automatically to the generated monogram at
`assets/img/{slug}-mono.svg` via the image's `onerror` handler — no code change needed, just drop a
real file back in under the same name.

## Hero background photo

`assets/img/hero-menu-scan.jpg` is used as the hero section's background image (desktop/tablet only,
≥760px) with a white-to-transparent gradient over it so the headline and search bar stay legible on
the left. On narrower screens the photo is skipped in favor of the original plain `--bg-soft`
background, to keep mobile loads light.

## Brand tokens

```
--purple:    #642878
--purple-dk: #4a1d59
--magenta:   #c81478
--teal:      #50a0b4
--mint:      #64a08c
--lime:      #8cb43c
--yellow:    #dcdc3c
--ink:       #1a1424
--bg-soft:   #faf8fb
```

Font: Lato (300 for the thin hero lines, 900 for bold accents, 400/700 for body) · Noto Kufi
Arabic for Arabic text. Both loaded from Google Fonts in `<head>`.

## Deploy

This is a static site — GitHub Pages + the existing `CNAME` file + your current Namecheap DNS
records need no changes. Push to the branch GitHub Pages is already serving from and it goes live
on the next build.

## Browser support notes

- The hero "ecosystem" visual (animated branching mark) only renders at desktop widths (≥1000px)
  and is skipped entirely on mobile for load speed.
- The draw-in animation respects `prefers-reduced-motion` — it's disabled outright for anyone with
  that OS setting on.
- No build step, no framework, no dependencies beyond the Google Fonts + Font Awesome CDN links
  already used sitewide.

/* =========================================================
   Al Mallah Bakeries: the ONE place to edit content.
   - branches: add/remove a branch here (and create its folder, see README.txt)
   - menu: items shown on EVERY branch page (same menu for all branches).
     Change a price by editing  price: 100000  (Lebanese pounds). If an
     item has price: null, no price is shown and the basket total is hidden.
   - photos: drop JPGs in assets/items/<id>.jpg and assets/branches/<slug>.jpg
     (they replace the logo placeholder automatically).
========================================================= */
window.MALLAH = {
  currency: 'ل.ل',
  branches: [
    { slug: 'dahye',          en: 'Dahye',            ar: 'الضاحية',          wa: '96171567582' },
    { slug: 'harethreik',     en: 'Haret Hreik',      ar: 'حارة حريك',        wa: '96171567582' },
    { slug: 'centromalljnah', en: 'Centro Mall Jnah', ar: 'سنترو مول الجناح', wa: '96171567582' },
    { slug: 'zkakalblat',     en: 'Zkak Al Blat',     ar: 'زقاق البلاط',      wa: '96171567582' },
    { slug: 'khalde',         en: 'Khalde',           ar: 'خلدة',             wa: '96171567582' },
    { slug: 'tyre',           en: 'Tyre',             ar: 'صور',              wa: '96171567582' },
    { slug: 'ghazieh',        en: 'Ghazieh',          ar: 'غازية',            wa: '96171567582' }
  ],
  menu: [
    {
      id: 'menu', title: 'المنيو',
      items: [
        { id: 'm01', name: 'زعتر بلدي',               price: 100000 },
        { id: 'm02', name: 'زعتر حلبي',               price: 100000 },
        { id: 'm03', name: 'زعتر مع خضرة',            price: 100000 },
        { id: 'm04', name: 'دوبلكس جبنة و زعتر',      price: 100000 },
        { id: 'm05', name: 'دوبلكس لحمة و جبنة',      price: 100000 },
        { id: 'm06', name: 'تركية',                   price: 100000 },
        { id: 'm07', name: 'أريشة',                   price: 100000 },
        { id: 'm08', name: 'لبنة خضار + مرتديلا',     price: 100000 },
        { id: 'm09', name: 'لبنة خضار',               price: 100000 }
      ]
    }
  ]
};

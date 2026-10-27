/* =========================================================
   Al Mallah Bakeries: the ONE place to edit content.
   - branches: add/remove a branch here (and create its folder, see README.txt)
   - menu: items shown on EVERY branch page (same menu for all branches).
     Add a price by setting  price: 150000  (Lebanese pounds). Until an
     item has a price, no price is shown and the basket total is hidden.
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
        { id: 'm01', name: 'زعتر بلدي',               price: null },
        { id: 'm02', name: 'زعتر حلبي',               price: null },
        { id: 'm03', name: 'زعتر مع خضرة',            price: null },
        { id: 'm04', name: 'دوبلكس جبنة و زعتر',      price: null },
        { id: 'm05', name: 'دوبلكس لحمة و جبنة',      price: null },
        { id: 'm06', name: 'تركية',                   price: null },
        { id: 'm07', name: 'أريشة',                   price: null },
        { id: 'm08', name: 'لبنة خضار + مرتديلا',     price: null },
        { id: 'm09', name: 'لبنة خضار',               price: null }
      ]
    }
  ]
};

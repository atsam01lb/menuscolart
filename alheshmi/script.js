const menu = [
  {
    title:"المشروبات الساخنة",
    image:"hot-drinks.jpg",
    items:[
      ["إسبريسو","100,000 ل.ل"],
      ["قهوة تركية","100,000 ل.ل"],
      ["نسكافيه","150,000 ل.ل"],
      ["كافيه لاتيه","150,000 ل.ل","نكهات متاحة: كراميل • فانيلا • بندق"],
      ["لاتيه حشمي","200,000 ل.ل"],
      ["كابتشينو","150,000 ل.ل"],
      ["شوكولاتة ساخنة","150,000 ل.ل"],
      ["هوت مارشميلو","200,000 ل.ل"],
      ["تشكيلة شاي","100,000 ل.ل"],
      ["حليب بالزنجبيل","150,000 ل.ل"]
    ]
  },
  {
    title:"فرابيه",
    image:"frappe.jpg",
    items:[
      ["موكا فرابيه","300,000 ل.ل"],
      ["أوريو","300,000 ل.ل"],
      ["كيت كات","300,000 ل.ل"],
      ["لوتس","300,000 ل.ل"],
      ["كراميل","300,000 ل.ل"],
      ["نسكافيه مثلج","300,000 ل.ل"],
      ["باونتي","300,000 ل.ل"],
      ["سنيكرز","300,000 ل.ل"],
      ["فرابتشينو","300,000 ل.ل"]
    ]
  },
  {
    title:"ميلك شيك",
    image:"shakes.jpg",
    items:[
      ["شوكولاتة","300,000 ل.ل"],
      ["فراولة","300,000 ل.ل"],
      ["فانيلا","300,000 ل.ل"],
      ["مكس شوكو بيري","300,000 ل.ل"],
      ["مكس شوكولاتة وفانيلا","300,000 ل.ل"]
    ]
  },
  {
    title:"سموذي",
    image:"smoothies.jpg",
    items:[
      ["فراولة","300,000 ل.ل"],
      ["مانغو","300,000 ل.ل"],
      ["فوريست","300,000 ل.ل"],
      ["كيوي","300,000 ل.ل"],
      ["مشكل","300,000 ل.ل"]
    ]
  },
  {
    title:"موكتيل",
    image:"mocktails.jpg",
    items:[
      ["آيس تي خوخ","300,000 ل.ل"],
      ["آيس تي توت العليق","300,000 ل.ل"],
      ["موهيتو","300,000 ل.ل"],
      ["باربي بابل","350,000 ل.ل"],
      ["بلو ويفز","300,000 ل.ل"],
      ["فرانكو بيلا","300,000 ل.ل"],
      ["مارشميلو","300,000 ل.ل"],
      ["ميلون بيري","300,000 ل.ل"]
    ]
  },
  {
    title:"المشروبات الخاصة",
    image:"special-drinks.jpg",
    items:[
      ["جامايكا","300,000 ل.ل"],
      ["بينا كولادا","350,000 ل.ل"],
      ["بلو لاغون","350,000 ل.ل"],
      ["بيستانانا","300,000 ل.ل"],
      ["حشمي سبيشل","300,000 ل.ل"],
      ["شوكونانا","300,000 ل.ل"]
    ]
  },
  {
    title:"العصائر الطازجة",
    image:"fresh.jpg",
    items:[
      ["برتقال","100,000 ل.ل"],
      ["جزر","200,000 ل.ل"],
      ["ليمون بالنعناع","150,000 ل.ل"],
      ["رمان","200,000 ل.ل"]
    ]
  },
  {
    title:"المشروبات الباردة",
    image:"cold-drinks.jpg",
    items:[
      ["فريسكو كبير","150,000 ل.ل"],
      ["فريسكو صغير","100,000 ل.ل"],
      ["لازيزا","100,000 ل.ل"],
      ["ميزا","100,000 ل.ل"],
      ["فريز","150,000 ل.ل"],
      ["مشروبات غازية","100,000 ل.ل","نكهات متاحة: ببسي • ميرندا • سفن أب • تمر هندي"],
      ["XXL","100,000 ل.ل"],
      ["ريد بول","200,000 ل.ل"],
      ["دارك بلو","100,000 ل.ل"],
      ["مياه معدنية","50,000 ل.ل"],
      ["ليبتون","100,000 ل.ل"],
      ["ريم مياه غازية","100,000 ل.ل"],
      ["ريهان","100,000 ل.ل"],
      ["إضافة مكسيكان","50,000 ل.ل"]
    ]
  },
  {
    title:"الكوكتيلات",
    image:"cocktails.jpg",
    items:[
      ["كوكتيل","350,000 ل.ل"],
      ["فواكه","350,000 ل.ل"],
      ["حشمي","400,000 ل.ل"]
    ]
  },
  {
    title:"السناكات",
    image:"snacks.jpg",
    items:[
      ["كرواسون","150,000 ل.ل"],
      ["ناتشوز","400,000 ل.ل"],
      ["برينغلز","100,000 ل.ل"],
      ["مكسرات","100,000 ل.ل"],
      ["مكسرات إضافية","200,000 ل.ل"]
    ]
  },
  {
    title:"الحلويات",
    image:"desserts.jpg",
    items:[
      ["تشيز كيك أوريو","300,000 ل.ل"],
      ["تشيز كيك لوتس","300,000 ل.ل"],
      ["تشيز كيك فراولة","300,000 ل.ل"],
      ["براوني","350,000 ل.ل"],
      ["فوندان","350,000 ل.ل"],
      ["كاسترد","100,000 ل.ل"],
      ["جيلي","80,000 ل.ل"],
      ["رز بحليب","100,000 ل.ل"],
      ["مهلبية","100,000 ل.ل"],
      ["كوكيز","300,000 ل.ل","نكهات متاحة: نوتيلا • كيندر • كنافة"]
    ]
  },
  {
    title:"آيس كريم",
    image:"ice-cream.jpg",
    items:[
      ["شوكولاموو","250,000 ل.ل"],
      ["فرايز موو","250,000 ل.ل"],
      ["كوب آيس كريم","150,000 ل.ل"],
      ["كوب آيس كريم سبيشل","200,000 ل.ل"],
      ["1 كغ آيس كريم سبيشل","800,000 ل.ل"],
      ["1 كغ آيس كريم","700,000 ل.ل"]
    ]
  },
  {
    title:"الأرجيلة",
    image:"arguile.jpg",
    items:[
      ["تفاح","300,000 ل.ل"],
      ["نعناع حامض","300,000 ل.ل"]
    ]
  },
  {
    title:"طلبات خارجية",
    image:"takeaway.jpg",
    items:[
      ["إسبريسو","50,000 ل.ل"],
      ["نسكافيه","100,000 ل.ل"],
      ["كابتشينو","100,000 ل.ل"],
      ["شوكولامو صغير","150,000 ل.ل"],
      ["شوكولامو كبير","200,000 ل.ل"],
      ["فريز موو كبير","200,000 ل.ل"],
      ["فريز موو صغير","150,000 ل.ل"]
    ]
  }
];

const menuContainer = document.getElementById("menuContainer");
const categoryTabs = document.getElementById("categoryTabs");

menu.forEach((section, index) => {
  const tab = document.createElement("button");
  tab.textContent = section.title;

  if(index === 0){
    tab.classList.add("active");
  }

  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".category-tabs button")
      .forEach(btn => btn.classList.remove("active"));

    tab.classList.add("active");

    document
      .getElementById(`section-${index}`)
      .scrollIntoView({ behavior:"smooth", block:"start" });
  });

  categoryTabs.appendChild(tab);

  const category = document.createElement("div");
  category.className = "menu-category reveal";
  category.id = `section-${index}`;
  category.style.backgroundImage = `url("assets/${section.image}")`;

  category.innerHTML = `
    <div class="category-content">
      <h3>${section.title}</h3>

      <div class="items">
        ${section.items.map((item, itemIndex) => `
          <div class="item" style="animation-delay:${itemIndex * 0.06}s">
            <div class="item-info">
              <span class="item-name">${item[0]}</span>
              ${item[2] ? `<div class="sub-item">${item[2]}</div>` : ""}
            </div>

            <span class="price">${item[1]}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  menuContainer.appendChild(category);
});

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const topbar = document.getElementById("topbar");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

window.addEventListener("scroll", () => {
  topbar.classList.toggle("scrolled", window.scrollY > 60);
});

const reveals = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("show");
    }
  });
}, { threshold:.12 });

reveals.forEach(el => observer.observe(el));

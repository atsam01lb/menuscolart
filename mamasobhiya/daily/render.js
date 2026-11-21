/* Builds the day cards from week.js. You do not need to edit this file. */
(function () {
  var data = window.DAILY_MENU;
  var ul = document.getElementById('days');
  if (!data || !ul) return;
  var note = document.getElementById('weekNote');
  var days = data.days || [];
  if (note && days.length) {
    note.textContent = '';
    [['من ', days[0].date], [' إلى ', days[days.length - 1].date]].forEach(function (p) {
      note.appendChild(document.createTextNode(p[0]));
      var d = document.createElement('bdi'); d.setAttribute('dir', 'ltr'); d.textContent = p[1]; note.appendChild(d);
    });
  }
  days.forEach(function (d, i) {
    var li = document.createElement('li');
    li.className = 'day';
    li.style.setProperty('--i', i);

    var h = document.createElement('h3'); h.textContent = d.day;
    var t = document.createElement('time'); t.textContent = d.date; t.setAttribute('dir', 'ltr');
    var head = document.createElement('div'); head.className = 'day-head';
    var hw = document.createElement('div'); hw.appendChild(h); hw.appendChild(t);
    var price = document.createElement('span'); price.className = 'day-price'; price.setAttribute('dir', 'ltr');
    var small = document.createElement('small'); small.textContent = '$';
    price.appendChild(small);
    price.appendChild(document.createTextNode(String(d.price != null ? d.price : data.price)));
    head.appendChild(hw); head.appendChild(price);

    var items = document.createElement('ul'); items.className = 'day-items';
    (d.items || []).forEach(function (it) {
      var l = document.createElement('li'); l.textContent = it; items.appendChild(l);
    });

    li.appendChild(head); li.appendChild(items);
    ul.appendChild(li);
  });
})();

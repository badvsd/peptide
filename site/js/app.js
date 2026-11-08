/* Общие функции и шаблоны сайта */
(function () {
  const S = window.SITE;

  const navItems = [
    ["index.html", "Главная"],
    ["catalog.html", "Каталог"],
    ["buyer.html", "Услуга байера"],
    ["delivery.html", "Доставка и оплата"],
    ["about.html", "О компании"],
    ["contacts.html", "Контакты"],
  ];

  function navHtml() {
    const current = location.pathname.split("/").pop() || "index.html";
    const links = navItems.map(([href, label]) => {
      const active = current === href ? " class='active'" : "";
      return `<a${active} href="${href}">${label}</a>`;
    }).join("");
    return links;
  }

  function headerHtml() {
    const phones = S.phones.map((p) => `<a href="tel:${p.replace(/[^+\d]/g, "")}">${p}</a>`).join("<span class='sep'>|</span>");
    return `
    <div class="topbar">
      <div class="container">
        <span>${S.city} · ${S.hours}</span>
        <div class="phones">${phones}<span class="sep">|</span><a href="mailto:${S.email}">${S.email}</a></div>
      </div>
    </div>
    <div class="header-row container">
      <a class="logo" href="index.html">${S.name}<span class="dot">.lab</span>
        <span class="sub">${S.tagline}</span>
      </a>
      <button class="burger" id="burger" aria-label="Меню">☰</button>
      <nav class="main-nav" id="mainNav">
        ${navHtml()}
        <a class="cart-link" href="cart.html">Корзина<span class="cart-badge" id="cartBadge">0</span></a>
        <a class="btn btn-primary" href="buyer.html">Найти препарат</a>
      </nav>
    </div>`;
  }

  function footerHtml() {
    return `
    <div class="footer-grid container">
      <div>
        <h4>${S.name}</h4>
        <p style="max-width:320px">${S.tagline}. Вся информация носит образовательный характер и предназначена для исследовательских целей.</p>
      </div>
      <div>
        <h4>Покупателям</h4>
        <ul>
          <li><a href="catalog.html">Каталог</a></li>
          <li><a href="delivery.html">Как сделать заказ</a></li>
          <li><a href="delivery.html#payment">Способы оплаты</a></li>
          <li><a href="delivery.html#delivery">Доставка</a></li>
          <li><a href="cart.html">Корзина</a></li>
        </ul>
      </div>
      <div>
        <h4>Компания</h4>
        <ul>
          <li><a href="about.html">О нас</a></li>
          <li><a href="contacts.html">Контакты</a></li>
          <li><a href="buyer.html">Услуга байера</a></li>
          <li><a href="privacy.html">Политика конфиденциальности</a></li>
        </ul>
      </div>
      <div>
        <h4>Связь с нами</h4>
        <ul>
          <li><a href="tel:${S.phones[0].replace(/[^+\d]/g, "")}">${S.phones[0]}</a></li>
          <li><a href="mailto:${S.email}">${S.email}</a></li>
          <li><a href="https://t.me/${S.telegram}" target="_blank" rel="noopener">Telegram</a></li>
          <li><a href="https://wa.me/${S.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        © ${new Date().getFullYear()} ${S.name}. Все права защищены. Только для исследовательских целей, не является лекарством.
      </div>
    </div>`;
  }

  function inject() {
    const hs = document.querySelectorAll("[data-header]");
    hs.forEach((el) => { el.innerHTML = `<header class="site-header">${headerHtml()}</header>`; });
    const fs = document.querySelectorAll("[data-footer]");
    fs.forEach((el) => { el.innerHTML = footerHtml(); });

    const burger = document.getElementById("burger");
    const nav = document.getElementById("mainNav");
    if (burger && nav) {
      burger.addEventListener("click", () => nav.classList.toggle("open"));
    }
  }

  /* Поиск товара в каталоге данных */
  window.Shop = window.Shop || {};
  window.Shop.findByCategory = function (slug) {
    return (window.CATALOG ? window.CATALOG.products : []).filter((p) => p.category === slug);
  };
  window.Shop.findById = function (id) {
    return (window.CATALOG ? window.CATALOG.products : []).find((p) => p.id === id) || null;
  };
  window.Shop.format = function (n) {
    return new Intl.NumberFormat("ru-RU").format(n || 0) + " ₽";
  };

  /* Уведомления */
  window.Shop.toast = function (msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 250); }, 2600);
  };

  /* Возрастное/исследовательское согласие */
  function ageBanner() {
    if (localStorage.getItem("pep_age_ok") === "1") return;
    const ov = document.createElement("div");
    ov.className = "age-overlay";
    ov.innerHTML = `
      <div class="age-box">
        <h2>Внимание</h2>
        <p>Сайт содержит информацию о веществах, которые могут использоваться в исследовательских целях.</p>
        <p>Я подтверждаю, что мне исполнилось 18 лет. Вся информация на сайте носит образовательный характер, а продукция предназначена для исследовательских целей и не является лекарством, БАДом или косметикой. Не используйте материалы без консультации специалиста.</p>
        <div class="btn-row">
          <button class="btn btn-primary" id="ageOk">Мне 18+, принимаю условия</button>
          <button class="btn btn-line" id="ageNo">Мне нет 18</button>
        </div>
      </div>`;
    document.body.appendChild(ov);
    document.getElementById("ageOk").addEventListener("click", () => {
      localStorage.setItem("pep_age_ok", "1");
      ov.remove();
    });
    document.getElementById("ageNo").addEventListener("click", () => {
      window.location.href = "https://yandex.ru";
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    inject();
    ageBanner();
    window.Shop.updateCartBadge && window.Shop.updateCartBadge();
  });
})();
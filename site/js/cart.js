/* Корзина на localStorage */
(function () {
  const KEY = "pep_cart";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function write(cart) { localStorage.setItem(KEY, JSON.stringify(cart)); }

  function itemKey(id, volume) { return id + "|" + (volume || ""); }

  window.Shop = window.Shop || {};

  window.Shop.getCart = read;

  window.Shop.cartItems = function () {
    const cart = read();
    const items = [];
    for (const k in cart) {
      const [id, volume] = k.split("|");
      const product = window.Shop.findById(id);
      if (!product) continue;
      items.push({ id, volume, qty: cart[k], product });
    }
    return items;
  };

  window.Shop.cartCount = function () {
    const cart = read();
    return Object.values(cart).reduce((a, b) => a + b, 0);
  };

  window.Shop.cartTotal = function () {
    return window.Shop.cartItems().reduce((s, it) => s + (it.product.price || 0) * it.qty, 0);
  };

  window.Shop.addToCart = function (id, volume, qty) {
    const cart = read();
    const k = itemKey(id, volume);
    cart[k] = (cart[k] || 0) + (qty || 1);
    write(cart);
    window.Shop.updateCartBadge();
  };

  window.Shop.setQty = function (id, volume, qty) {
    const cart = read();
    const k = itemKey(id, volume);
    if (qty <= 0) delete cart[k]; else cart[k] = qty;
    write(cart);
    window.Shop.updateCartBadge();
  };

  window.Shop.removeItem = function (id, volume) {
    window.Shop.setQty(id, volume, 0);
  };

  window.Shop.clearCart = function () { localStorage.removeItem(KEY); window.Shop.updateCartBadge(); };

  window.Shop.updateCartBadge = function () {
    const n = window.Shop.cartCount();
    const el = document.getElementById("cartBadge");
    if (el) { el.textContent = n; el.style.display = n ? "flex" : "none"; }
  };

  /* Собрать текст заказа */
  window.Shop.orderMessage = function () {
    const items = window.Shop.cartItems();
    const lines = items.map((it) => `${it.product.name}${it.volume ? " (" + it.volume + ")" : ""} — ${it.qty} шт. — ${window.Shop.format(it.product.price * it.qty)}`);
    const total = window.Shop.cartTotal();
    return `Здравствуйте! Заказ на сайте ${window.SITE.name}:\n${lines.join("\n")}\nИтого: ${window.Shop.format(total)}`;
  };

  window.Shop.openMessenger = function (channel, message) {
    const S = window.SITE;
    let url;
    if (channel === "wa") url = "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(message);
    else if (channel === "tg") url = "https://t.me/" + S.telegram + "?text=" + encodeURIComponent(message);
    else url = "mailto:" + S.email + "?subject=" + encodeURIComponent("Заказ на " + S.name) + "&body=" + encodeURIComponent(message);
    window.open(url, "_blank");
    return url;
  };
})();
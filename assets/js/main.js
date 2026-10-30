/* ==========================================================================
   ASNANI FOOTWEAR — Shared site script
   Every module checks that its markup exists, so this one file can be
   included on all five pages (index, about, products, gallery, contact).
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Current page highlight in navigation ---------- */
  function markCurrentPage() {
    var file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    var links = document.querySelectorAll("[data-nav]");
    var matched = false;
    links.forEach(function (link) {
      if (link.getAttribute("href").toLowerCase() === file) matched = true;
    });
    // Fall back to the page's own declaration (e.g. when previewed outside a web server)
    if (!matched) file = (document.body.getAttribute("data-page") || "index") + ".html";
    links.forEach(function (link) {
      if (link.getAttribute("href").toLowerCase() === file) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  /* ---------- Announcement bar rotation ---------- */
  function initAnnouncement() {
    var msgs = document.querySelectorAll(".announce__msg");
    if (msgs.length < 2 || reduceMotion) return;
    var i = 0;
    setInterval(function () {
      msgs[i].classList.remove("is-active");
      msgs[i].setAttribute("aria-hidden", "true");
      i = (i + 1) % msgs.length;
      msgs[i].classList.add("is-active");
      msgs[i].removeAttribute("aria-hidden");
    }, 4200);
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 40); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.getElementById("mobile-menu");
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.classList.toggle("is-open", open);
      menu.toggleAttribute("inert", !open);
    }
    setOpen(false);

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    // Close when a link is chosen, on Escape, or when the desktop nav takes over
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1024px)").addEventListener("change", function (e) {
      if (e.matches) setOpen(false);
    });
  }

  /* ---------- Testimonial carousel ---------- */
  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach(function (root) {
      var track = root.querySelector(".carousel");
      var prev = root.querySelector("[data-prev]");
      var next = root.querySelector("[data-next]");
      var status = root.querySelector("[data-carousel-status]");
      if (!track || !prev || !next) return;
      var slides = Array.prototype.slice.call(track.children);

      function step() {
        var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return slides[0].getBoundingClientRect().width + gap;
      }
      function update() {
        var max = track.scrollWidth - track.clientWidth - 2;
        prev.disabled = track.scrollLeft <= 2;
        next.disabled = track.scrollLeft >= max;
        // Hide controls entirely when every card already fits
        root.querySelector("[data-carousel-controls]").hidden = max <= 0;
        if (status) {
          var first = Math.round(track.scrollLeft / step()) + 1;
          var visible = Math.max(1, Math.round(track.clientWidth / step()));
          var last = Math.min(slides.length, first + visible - 1);
          status.textContent = (first === last ? first : first + "–" + last) + " of " + slides.length;
        }
      }
      function go(dir) {
        track.scrollBy({ left: dir * step(), behavior: reduceMotion ? "auto" : "smooth" });
        setTimeout(update, 500); // settle state after the smooth scroll ends
      }
      prev.addEventListener("click", function () { go(-1); });
      next.addEventListener("click", function () { go(1); });
      track.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      update();
    });
  }

  /* ---------- Newsletter (front-end demo only) ----------
     No mailing-list service is connected yet. The form validates the address
     and tells the visitor plainly that nothing was submitted. */
  function initNewsletter() {
    document.querySelectorAll("[data-newsletter]").forEach(function (form) {
      var input = form.querySelector("input[type=email]");
      var msg = form.querySelector(".form-msg");
      var pattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var value = input.value.trim();
        msg.classList.remove("is-error", "is-ok");
        if (!value) {
          input.setAttribute("aria-invalid", "true");
          msg.textContent = "Enter your email address to continue.";
          msg.classList.add("is-error");
          input.focus();
          return;
        }
        if (!pattern.test(value)) {
          input.setAttribute("aria-invalid", "true");
          msg.textContent = "That email address looks incomplete. Check it and try again.";
          msg.classList.add("is-error");
          input.focus();
          return;
        }
        input.removeAttribute("aria-invalid");
        msg.textContent = "Thanks! This sign-up form is a preview and is not connected to a mailing list yet, so your email has not been saved.";
        msg.classList.add("is-ok");
        form.reset();
      });
      input.addEventListener("input", function () {
        input.removeAttribute("aria-invalid");
        if (msg.classList.contains("is-error")) { msg.textContent = ""; msg.classList.remove("is-error"); }
      });
    });
  }

  /* ---------- Scroll reveal ----------
     Only elements that start below the fold animate; everything is visible
     without JavaScript or with reduced motion. */
  function initReveal() {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    var items = Array.prototype.filter.call(document.querySelectorAll(".reveal"), function (el) {
      return el.getBoundingClientRect().top > window.innerHeight;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealing");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px 120px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- WhatsApp enquiry links ----------
     Any element with data-wa-product="Name" gets a pre-filled WhatsApp link. */
  function initEnquiryLinks() {
    document.querySelectorAll("[data-wa-product]").forEach(function (a) {
      var text = "Hello Asnani Footwear! I'm interested in the " + a.getAttribute("data-wa-product") +
        ". Could you share availability, sizes and price?";
      a.href = "https://wa.me/918408821319?text=" + encodeURIComponent(text);
    });
  }

  /* ---------- Catalog filters (products.html) ----------
     Cards carry data-category (space-separated) and data-for (men / women /
     unisex). A link such as products.html#boots or products.html#women opens
     the catalog pre-filtered. */
  function initCatalog() {
    var root = document.querySelector("[data-catalog]");
    if (!root) return;
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-category]"));
    var catBtns = Array.prototype.slice.call(document.querySelectorAll("[data-filter-cat]"));
    var forBtns = Array.prototype.slice.call(document.querySelectorAll("[data-filter-for]"));
    var search = document.getElementById("catalog-search");
    var count = document.querySelector("[data-catalog-count]");
    var empty = document.querySelector("[data-catalog-empty]");
    var state = { cat: "all", who: "all", q: "" };

    function apply() {
      var shown = 0, styles = 0;
      cards.forEach(function (card) {
        var cats = card.getAttribute("data-category").split(" ");
        var who = card.getAttribute("data-for");
        var name = (card.getAttribute("data-name") || card.textContent).toLowerCase();
        var ok = (state.cat === "all" || cats.indexOf(state.cat) > -1) &&
                 (state.who === "all" || who === state.who || who === "unisex" || who === "all") &&
                 (!state.q || name.indexOf(state.q) > -1);
        card.hidden = !ok;
        if (ok) { shown++; if (!card.hasAttribute("data-enquiry")) styles++; }
      });
      catBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter-cat") === state.cat)); });
      forBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter-for") === state.who)); });
      if (count) {
        count.textContent = styles === 0 && shown > 0 ? "Available on request"
          : styles === 1 ? "Showing 1 style" : "Showing " + styles + " styles";
      }
      if (empty) empty.hidden = shown > 0;
    }

    catBtns.forEach(function (b) {
      b.addEventListener("click", function () { state.cat = b.getAttribute("data-filter-cat"); apply(); });
    });
    forBtns.forEach(function (b) {
      b.addEventListener("click", function () { state.who = b.getAttribute("data-filter-for"); apply(); });
    });
    if (search) {
      search.addEventListener("input", function () { state.q = search.value.trim().toLowerCase(); apply(); });
    }
    document.querySelectorAll("[data-catalog-reset]").forEach(function (b) {
      b.addEventListener("click", function () {
        state = { cat: "all", who: "all", q: "" };
        if (search) search.value = "";
        apply();
      });
    });

    function fromHash() {
      var token = location.hash.replace("#", "").toLowerCase();
      if (!token) return;
      if (token === "men" || token === "women") state.who = token;
      else if (catBtns.some(function (b) { return b.getAttribute("data-filter-cat") === token; })) state.cat = token;
      else return;
      apply();
    }
    window.addEventListener("hashchange", fromHash);
    fromHash();
    apply();
  }

  /* ---------- Lightbox (gallery.html) ----------
     Buttons with data-lightbox open #lightbox showing their image, caption and
     a WhatsApp "ask about similar styles" link. Arrow keys move between images. */
  function initLightbox() {
    var dialog = document.getElementById("lightbox");
    var triggers = Array.prototype.slice.call(document.querySelectorAll("[data-lightbox]"));
    if (!dialog || !triggers.length || typeof dialog.showModal !== "function") return;
    var img = dialog.querySelector("[data-lb-img]");
    var caption = dialog.querySelector("[data-lb-caption]");
    var position = dialog.querySelector("[data-lb-position]");
    var ask = dialog.querySelector("[data-lb-ask]");
    var current = 0, opener = null;

    function show(i) {
      current = (i + triggers.length) % triggers.length;
      var t = triggers[current];
      var source = t.querySelector("img");
      img.src = t.getAttribute("data-full") || source.src;
      img.alt = source.alt;
      caption.textContent = t.getAttribute("data-caption");
      position.textContent = (current + 1) + " of " + triggers.length;
      var text = "Hello Asnani Footwear! I saw this look on your website (" + t.getAttribute("data-caption") +
        "). Do you have something similar?";
      ask.href = "https://wa.me/918408821319?text=" + encodeURIComponent(text);
    }
    triggers.forEach(function (t, i) {
      t.addEventListener("click", function () { opener = t; show(i); dialog.showModal(); });
    });
    dialog.querySelector("[data-lb-prev]").addEventListener("click", function () { show(current - 1); });
    dialog.querySelector("[data-lb-next]").addEventListener("click", function () { show(current + 1); });
    dialog.querySelector("[data-lb-close]").addEventListener("click", function () { dialog.close(); });
    // Click on the backdrop closes
    dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
    });
    dialog.addEventListener("close", function () { if (opener) opener.focus(); });
  }

  /* ---------- Copy buttons ---------- */
  function initCopyButtons() {
    document.querySelectorAll("[data-copy]").forEach(function (btn) {
      var label = btn.querySelector("[data-copy-label]") || btn;
      var original = label.textContent;
      btn.addEventListener("click", function () {
        var text = btn.getAttribute("data-copy");
        var done = function (msg) {
          label.textContent = msg;
          setTimeout(function () { label.textContent = original; }, 2000);
        };
        var fallback = function () {
          // Select the visible value so it can be copied by hand
          var target = document.getElementById(btn.getAttribute("aria-controls"));
          if (target) {
            var range = document.createRange();
            range.selectNodeContents(target);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          }
          done("Selected");
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { done("Copied"); }, fallback);
        } else {
          fallback();
        }
      });
    });
  }

  /* ---------- Enquiry form → WhatsApp (contact.html) ----------
     Nothing is sent from the website. The "Send on WhatsApp" link opens a
     chat with the visitor's details typed in; the visitor presses send. */
  function initEnquiryForm() {
    var form = document.querySelector("[data-enquiry-form]");
    if (!form) return;
    var link = form.querySelector("[data-enquiry-send]");
    var fields = {
      name: form.querySelector("#enquiry-name"),
      interest: form.querySelector("#enquiry-interest"),
      size: form.querySelector("#enquiry-size"),
      city: form.querySelector("#enquiry-city"),
      message: form.querySelector("#enquiry-message")
    };

    function compose() {
      var lines = ["Hello Asnani Footwear!"];
      if (fields.name.value.trim()) lines.push("Name: " + fields.name.value.trim());
      if (fields.interest.value) lines.push("Looking for: " + fields.interest.value);
      if (fields.size.value.trim()) lines.push("Size: " + fields.size.value.trim());
      if (fields.city.value.trim()) lines.push("City: " + fields.city.value.trim());
      if (fields.message.value.trim()) lines.push("", fields.message.value.trim());
      link.href = "https://wa.me/918408821319?text=" + encodeURIComponent(lines.join("\n"));
    }

    function setError(input, msg) {
      var err = document.getElementById(input.id + "-error");
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      if (err) { err.textContent = msg; err.hidden = !msg; }
    }

    function validate() {
      var ok = true, first = null;
      if (!fields.name.value.trim()) { setError(fields.name, "Enter your name so we know who we're talking to."); ok = false; first = first || fields.name; }
      else setError(fields.name, "");
      if (!fields.message.value.trim()) { setError(fields.message, "Tell us what you're looking for."); ok = false; first = first || fields.message; }
      else setError(fields.message, "");
      if (first) first.focus();
      return ok;
    }

    form.addEventListener("input", function (e) {
      compose();
      if (e.target.getAttribute("aria-invalid") === "true" && e.target.value.trim()) setError(e.target, "");
    });
    form.addEventListener("change", compose);
    link.addEventListener("click", function (e) {
      compose();
      if (!validate()) e.preventDefault();
    });
    // Enter in a text field: validate and move focus to the send link
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      compose();
      if (validate()) link.focus();
    });
    compose();
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(Math.max(2026, new Date().getFullYear()));
  }

  function boot() {
    markCurrentPage();
    initAnnouncement();
    initHeader();
    initMobileMenu();
    initCarousels();
    initNewsletter();
    initEnquiryLinks();
    initCatalog();
    initLightbox();
    initCopyButtons();
    initEnquiryForm();
    initReveal();
    initYear();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();

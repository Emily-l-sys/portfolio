(function () {
  const list = document.getElementById("projectList");
  const layouts = ["layout-a", "layout-b", "layout-c"];

  list.innerHTML = PROJECTS.map((p, i) => {
    const no = String(i + 1).padStart(2, "0");
    return `
    <article class="project ${layouts[i % layouts.length]}">
      <figure class="proj-media">
        <span class="proj-no">No.${no}</span>
        <img src="${p.image}" alt="${p.title}" loading="lazy" data-ph="${i}">
      </figure>
      <div class="proj-text">
        <div class="proj-meta">
          <span class="date">${p.date}</span>
        </div>
        <span class="tag proj-category">${p.category}</span>
        <h3 class="proj-title">${p.title}</h3>
        <p class="proj-desc">${p.desc}</p>
        <ul class="tech">${p.tech.map(t => `<li>${t}</li>`).join("")}</ul>
        <a class="proj-link" href="${p.link}">查看详情 →</a>
      </div>
    </article>`;
  }).join("");

  list.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      const hue = (+img.dataset.ph * 57 + 18) % 360;
      const ph = document.createElement("div");
      ph.className = "media-ph";
      ph.style.background = `linear-gradient(135deg, hsl(${hue}, 42%, 72%), hsl(${(hue + 45) % 360}, 38%, 55%))`;
      ph.textContent = img.alt;
      img.replaceWith(ph);
    });
  });

  const menuBtn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");

  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.classList.toggle("open", open);
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.classList.remove("open");
    });
  });

  // 平滑滚动：为固定顶部导航留出偏移量
  const HEADER_OFFSET = 84;
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const top = target === document.getElementById("top")
        ? 0
        : target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
    });
  });

  // 滚动监听：当前区块对应的导航项设置 aria-current
  const navLinks = Array.from(nav.querySelectorAll("a"));

  function setActive(id) {
    navLinks.forEach((a) => {
      if (a.getAttribute("href") === "#" + id) {
        a.setAttribute("aria-current", "true");
      } else {
        a.removeAttribute("aria-current");
      }
    });
  }

  const spyTargets = navLinks
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  spyTargets.forEach((s) => spy.observe(s));

  // 返回顶部按钮：滚动超过一屏后显示
  const toTop = document.getElementById("toTop");

  function onScroll() {
    const y = window.scrollY;
    toTop.classList.toggle("show", y > window.innerHeight * 0.6);
    // 页面底部时兜底高亮最后一个区块（联系方式）
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 80) {
      setActive("contact");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 主题切换：浅色为默认态，深色通过 data-theme="dark" 启用，localStorage 持久化
  const themeToggle = document.getElementById("themeToggle");
  const docEl = document.documentElement;

  function syncThemeToggle() {
    const isDark = docEl.getAttribute("data-theme") === "dark";
    themeToggle.setAttribute("aria-label", isDark ? "切换为浅色主题" : "切换为深色主题");
  }
  syncThemeToggle();

  themeToggle.addEventListener("click", () => {
    const isDark = docEl.getAttribute("data-theme") === "dark";
    if (isDark) {
      docEl.removeAttribute("data-theme");
      try { localStorage.setItem("theme", "light"); } catch (e) {}
    } else {
      docEl.setAttribute("data-theme", "dark");
      try { localStorage.setItem("theme", "dark"); } catch (e) {}
    }
    syncThemeToggle();
  });
})();

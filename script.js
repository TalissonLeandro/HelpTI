/* ============================================================
   HELP TI — Scripts
   ============================================================ */

// ===== NAVBAR: glassmorphism ao rolar =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ===== MENU MOBILE =====
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });

  // fechar menu ao clicar em um link
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}

// ===== SCROLL SUAVE para âncoras =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // altura da navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== REVEAL ao rolar (IntersectionObserver) =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // delay escalonado para categorias
      const delay = entry.target.classList.contains('categoria')
        ? Array.from(document.querySelectorAll('.categoria')).indexOf(entry.target) * 80
        : 0;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal, .categoria').forEach(el => {
  revealObserver.observe(el);
});

// ===== ANIMAÇÃO DE ENTRADA DOS CARDS =====
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.card');
      cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(16px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.35s ease, transform 0.35s ease, box-shadow 0.25s ease, border-color 0.25s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, index * 60);
      });
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.cards').forEach(el => {
  cardObserver.observe(el);
});

/* ============================================================
   TROCA AUTOMÁTICA DE LOGO (claro/escuro)
   ============================================================ */
(function () {

  // ----------------------------------------------------------
  // Detecta se a página está dentro da pasta /modulos/
  // para montar o caminho correto dos arquivos de logo
  // ----------------------------------------------------------
  const isSubpage = window.location.pathname.includes('/modulos/');
  const base      = isSubpage ? '../' : '';

  const LOGO_LIGHT = base + 'logo1.png'; // tema claro
  const LOGO_DARK  = base + 'logo2.png'; // tema escuro

  // ----------------------------------------------------------
  // Localiza a imagem da logo dentro do <header>
  // Tenta seletores do mais específico ao mais genérico
  // ----------------------------------------------------------
  function findLogoImg() {
    return (
      document.querySelector('header .logo img')   ||
      document.querySelector('header .navbar img') ||
      document.querySelector('header a img')       ||
      document.querySelector('header img')         ||
      null
    );
  }

  // ----------------------------------------------------------
  // Aplica a logo correta com base no estado atual do tema
  // ----------------------------------------------------------
  function updateLogo() {
    const img = findLogoImg();
    if (!img) return;

    const isDark = document.documentElement.classList.contains('dark-mode');
    const newSrc = isDark ? LOGO_DARK : LOGO_LIGHT;

    // atualiza src e alt sempre (garante consistência)
    img.src = newSrc;
    img.alt = 'Logo Help TI';
  }

  // ----------------------------------------------------------
  // Observa mudanças de classe no <html> em tempo real
  // (ativado pelo painel de acessibilidade)
  // ----------------------------------------------------------
  const themeObserver = new MutationObserver(updateLogo);

  themeObserver.observe(document.documentElement, {
    attributes:      true,
    attributeFilter: ['class'],
  });

  // ----------------------------------------------------------
  // Observa preferência do sistema operacional
  // Só aplica se o usuário não tiver preferência manual salva
  // ----------------------------------------------------------
  window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (localStorage.getItem('helpti_dark') === null) {
        updateLogo();
      }
    });

  // ----------------------------------------------------------
  // Aplica logo imediatamente ao carregar a página
  // ----------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLogo);
  } else {
    updateLogo();
  }

})();

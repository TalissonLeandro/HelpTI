/* ============================================================
   HELP TI — Sistema de Acessibilidade
   ============================================================ */

(function () {
  'use strict';

  // ===== CONSTANTES =====
  const STORAGE = {
    DARK:     'helpti_dark',
    CONTRAST: 'helpti_contrast',
    FONT:     'helpti_font',
  };

  const FONT_SIZES = [90, 100, 110, 120, 130]; // % do root
  const FONT_DEFAULT_INDEX = 1; // 100%

  // ===== ESTADO =====
  let state = {
    dark:     localStorage.getItem(STORAGE.DARK)     === 'true',
    contrast: localStorage.getItem(STORAGE.CONTRAST) === 'true',
    fontIdx:  parseInt(localStorage.getItem(STORAGE.FONT) ?? FONT_DEFAULT_INDEX, 10),
  };

  // garante índice válido
  if (state.fontIdx < 0 || state.fontIdx >= FONT_SIZES.length) {
    state.fontIdx = FONT_DEFAULT_INDEX;
  }

  // ===== APLICAR PREFERÊNCIAS =====
  function applyAll() {
    applyDark();
    applyContrast();
    applyFont();
  }

  function applyDark() {
    document.documentElement.classList.toggle('dark-mode', state.dark);
    localStorage.setItem(STORAGE.DARK, state.dark);
    const btn = document.getElementById('a11y-dark-btn');
    if (btn) {
      btn.setAttribute('aria-pressed', state.dark);
      btn.querySelector('.a11y-btn-label').textContent = state.dark ? 'Modo claro' : 'Modo escuro';
      btn.querySelector('.a11y-btn-icon').textContent  = state.dark ? '☀️' : '🌙';
    }
  }

  function applyContrast() {
    // alto contraste sobrepõe dark mode
    document.documentElement.classList.toggle('high-contrast', state.contrast);
    localStorage.setItem(STORAGE.CONTRAST, state.contrast);
    const btn = document.getElementById('a11y-contrast-btn');
    if (btn) {
      btn.setAttribute('aria-pressed', state.contrast);
      btn.querySelector('.a11y-btn-label').textContent = state.contrast ? 'Contraste normal' : 'Alto contraste';
    }
  }

  function applyFont() {
    document.documentElement.style.fontSize = FONT_SIZES[state.fontIdx] + '%';
    localStorage.setItem(STORAGE.FONT, state.fontIdx);
    updateFontButtons();
  }

  function updateFontButtons() {
    const dec = document.getElementById('a11y-font-dec');
    const inc = document.getElementById('a11y-font-inc');
    if (dec) dec.disabled = state.fontIdx === 0;
    if (inc) inc.disabled = state.fontIdx === FONT_SIZES.length - 1;

    const label = document.getElementById('a11y-font-label');
    if (label) label.textContent = FONT_SIZES[state.fontIdx] + '%';
  }

  // ===== CRIAR PAINEL =====
  function buildPanel() {
    // evita duplicação
    if (document.getElementById('a11y-widget')) return;

    const html = `
      <div id="a11y-widget" role="region" aria-label="Painel de acessibilidade">

        <!-- Botão flutuante -->
        <button
          id="a11y-toggle"
          aria-expanded="false"
          aria-controls="a11y-panel"
          aria-label="Abrir painel de acessibilidade"
          title="Acessibilidade"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
               stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 8v4l3 3"/>
            <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none"/>
            <path d="M9 12h6M12 12v5M9.5 17l2.5-5 2.5 5"/>
          </svg>
          <svg id="a11y-icon-main" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
               viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="5" r="2"/>
            <path d="M12 7v6"/>
            <path d="M8 10h8"/>
            <path d="M10 13l-2 6"/>
            <path d="M14 13l2 6"/>
          </svg>
        </button>

        <!-- Painel -->
        <div
          id="a11y-panel"
          role="dialog"
          aria-label="Opções de acessibilidade"
          aria-hidden="true"
        >
          <div class="a11y-panel-header">
            <span class="a11y-panel-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                   stroke-linejoin="round" aria-hidden="true">
                <circle cx="12" cy="5" r="2"/>
                <path d="M12 7v6"/><path d="M8 10h8"/>
                <path d="M10 13l-2 6"/><path d="M14 13l2 6"/>
              </svg>
              Acessibilidade
            </span>
            <button id="a11y-close" aria-label="Fechar painel de acessibilidade">✕</button>
          </div>

          <div class="a11y-panel-body">

            <!-- Modo escuro -->
            <button id="a11y-dark-btn" class="a11y-option-btn" aria-pressed="false">
              <span class="a11y-btn-icon">🌙</span>
              <span class="a11y-btn-label">Modo escuro</span>
              <span class="a11y-toggle-indicator" aria-hidden="true"></span>
            </button>

            <!-- Alto contraste -->
            <button id="a11y-contrast-btn" class="a11y-option-btn" aria-pressed="false">
              <span class="a11y-btn-icon">◑</span>
              <span class="a11y-btn-label">Alto contraste</span>
              <span class="a11y-toggle-indicator" aria-hidden="true"></span>
            </button>

            <!-- Tamanho da fonte -->
            <div class="a11y-font-control" role="group" aria-label="Tamanho da fonte">
              <span class="a11y-font-title">Tamanho do texto</span>
              <div class="a11y-font-row">
                <button id="a11y-font-dec" aria-label="Diminuir fonte" title="Diminuir">A−</button>
                <span id="a11y-font-label" aria-live="polite" aria-atomic="true">100%</span>
                <button id="a11y-font-inc" aria-label="Aumentar fonte" title="Aumentar">A+</button>
              </div>
            </div>

            <!-- Reset -->
            <button id="a11y-reset-btn" class="a11y-reset-btn">
              ↺ Restaurar padrões
            </button>

          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html.trim();
    document.body.appendChild(wrapper.firstElementChild);

    bindEvents();
    applyAll(); // sincroniza visual dos botões com estado salvo
  }

  // ===== EVENTOS =====
  function bindEvents() {
    // abrir/fechar painel
    const toggle = document.getElementById('a11y-toggle');
    const panel  = document.getElementById('a11y-panel');
    const close  = document.getElementById('a11y-close');

    toggle.addEventListener('click', () => {
      const open = panel.getAttribute('aria-hidden') === 'true';
      panel.setAttribute('aria-hidden', !open);
      toggle.setAttribute('aria-expanded', open);
      panel.classList.toggle('open', open);
      if (open) {
        // foco no primeiro botão do painel
        setTimeout(() => document.getElementById('a11y-dark-btn')?.focus(), 50);
      }
    });

    close.addEventListener('click', () => {
      panel.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      panel.classList.remove('open');
      toggle.focus();
    });

    // fechar com Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
        toggle.focus();
      }
    });

    // fechar ao clicar fora
    document.addEventListener('click', (e) => {
      const widget = document.getElementById('a11y-widget');
      if (widget && !widget.contains(e.target) && panel.classList.contains('open')) {
        panel.setAttribute('aria-hidden', 'true');
        toggle.setAttribute('aria-expanded', 'false');
        panel.classList.remove('open');
      }
    });

    // modo escuro
    document.getElementById('a11y-dark-btn').addEventListener('click', () => {
      if (state.contrast) {
        state.contrast = false;
        applyContrast();
      }
      state.dark = !state.dark;
      applyDark();
    });

    // alto contraste
    document.getElementById('a11y-contrast-btn').addEventListener('click', () => {
      if (state.dark && !state.contrast) {
        state.dark = false;
        applyDark();
      }
      state.contrast = !state.contrast;
      applyContrast();
    });

    // fonte −
    document.getElementById('a11y-font-dec').addEventListener('click', () => {
      if (state.fontIdx > 0) {
        state.fontIdx--;
        applyFont();
      }
    });

    // fonte +
    document.getElementById('a11y-font-inc').addEventListener('click', () => {
      if (state.fontIdx < FONT_SIZES.length - 1) {
        state.fontIdx++;
        applyFont();
      }
    });

    // reset
    document.getElementById('a11y-reset-btn').addEventListener('click', () => {
      state.dark     = false;
      state.contrast = false;
      state.fontIdx  = FONT_DEFAULT_INDEX;
      applyAll();
    });
  }

  // ===== INIT =====
  // aplica preferências salvas ANTES do paint (evita flash)
  applyAll();

  // constrói o painel após o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildPanel);
  } else {
    buildPanel();
  }

})();

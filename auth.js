/* ==========================
   auth.js  (versión actual)
   ========================== */

/* 1. Credenciales (en un sistema real esto iría en el servidor o una BD segura) */
const ADMIN_CREDENTIALS = {
  username: 'Administrador',
  password: 'admin'
};

/* 2. Páginas que SÍ requieren sesión iniciada
      (registrar.html ya no es protegida: el botón “Registrar”
       debe poder abrirse sin iniciar sesión) */
const PROTECTED_PAGES = [
  'dashboard.html',
  'eliminar.html',
  'listar.html',
  'editar.html'
];

/* 3. Utilidad para obtener el nombre de la página actual, todo en minúsculas */
function currentPage() {
  /* Si la URL termina en “/”, asumimos index.html */
  const page = window.location.pathname.split('/').pop().toLowerCase();
  return page || 'index.html';
}

/* 4. Comprobar estado de autenticación y redirigir según corresponda */
function checkAuth() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const page = currentPage();

  if (PROTECTED_PAGES.includes(page) && !isLoggedIn) {
    /* Usuario NO logueado intentando entrar a página protegida */
    window.location.href = 'index.html';
  }

  if (page === 'index.html' && isLoggedIn) {
    /* Usuario ya logueado y aún así está en login → envíalo al dashboard */
    window.location.href = 'dashboard.html';
  }
}

/* 5. Listeners al cargar el DOM */
document.addEventListener('DOMContentLoaded', () => {
  /* — Verificación inicial — */
  checkAuth();

  /* — Manejador del formulario de login — */
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      /* Validación sencilla de credenciales */
      if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password
      ) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
      } else {
        alert('Credenciales incorrectas. Intente nuevamente.');
      }
    });
  }

  /* — Botón “Registrar” en el panel azul (clase .btn-outline) — */
  const registerBtn = document.querySelector('.btn-outline');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      window.location.href = 'registrar.html';
    });
  }

  /* — Botón de logout en páginas protegidas (id="logoutBtn") — */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      window.location.href = 'index.html';
    });
  }
});

/* ==========================
   auth.js  (versión actual)
   ========================== */

/* ...todo tu código tal cual... */

/* AGREGADO: pequeño helper para depurar */
console.log('[auth.js] cargado — página:', window.location.pathname);

/* AGREGADO: escucha también evento popstate (navegador “atrás/adelante”)  */
window.addEventListener('popstate', checkAuth);

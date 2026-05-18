export default defineNuxtRouteMiddleware((to, from) => {
  // Karena autentikasi kamu berbasis localStorage ('jastiper_user'),
  // kita mengeceknya di sisi client (browser).
  if (import.meta.client) {
    const user = localStorage.getItem('jastiper_user');
    
    if (!user) {
      alert('Hanya Jastiper yang bisa masuk. Silakan daftar/login dulu! 🚀');
      return navigateTo('/register'); // Sesuaikan dengan rute login/register-mu
    }
  }
});

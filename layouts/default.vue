<template>
  <div class="flex flex-col min-h-screen">
    <!-- BottomNavBar -->
    <nav class="!fixed !bottom-0 !left-0 !w-full z-[100] flex justify-around items-center bg-white pb-6 pt-2 px-4 rounded-t-[40px] border-t-4 border-primary/5 shadow-[0_-10px_40px_rgba(255,183,206,0.2)]">
      <NuxtLink to="/" class="flex flex-col items-center justify-center p-2 transition-all" :class="{ 'text-primary': $route.path === '/' }">
        <span class="material-symbols-outlined">home</span>
        <span class="text-[10px] font-bold uppercase tracking-widest mt-1">Home</span>
      </NuxtLink>
      <NuxtLink to="/jastiper/dashboard" class="flex flex-col items-center justify-center p-2 transition-all" :class="{ 'text-primary': $route.path.startsWith('/jastiper/dashboard') }">
        <span class="material-symbols-outlined">shopping_cart</span>
        <span class="text-[10px] font-bold uppercase tracking-widest mt-1">My Jastip</span>
      </NuxtLink>
      <NuxtLink to="/orders" class="flex flex-col items-center justify-center p-2 transition-all" :class="{ 'text-primary': $route.path.startsWith('/orders') }">
        <span class="material-symbols-outlined">receipt_long</span>
        <span class="text-[10px] font-bold uppercase tracking-widest mt-1">Orders</span>
      </NuxtLink>
      <NuxtLink to="/profile" class="flex flex-col items-center justify-center p-2 transition-all" :class="{ 'text-primary': $route.path.startsWith('/profile') }">
        <span class="material-symbols-outlined">person</span>
        <span class="text-[10px] font-bold uppercase tracking-widest mt-1">Profile</span>
      </NuxtLink>
    </nav>

    <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur-xl rounded-b-[32px] shadow-[0_8px_30px_rgb(236,72,153,0.15)] border-b border-primary/5">
      <NuxtLink to="/" class="flex items-center gap-2 group">
        <div class="bg-primary text-white p-1.5 rounded-xl group-hover:rotate-12 transition-transform">
          <span class="material-symbols-outlined text-xl fill">shopping_bag</span>
        </div>
        <div class="text-2xl font-black text-primary italic font-plus-jakarta tracking-tighter">
          JastipCoyy
        </div>
      </NuxtLink>
      
      <ClientOnly>
        <div class="flex items-center gap-4">
          <!-- Actions -->
          <div class="flex items-center gap-3">
            <NuxtLink 
              to="/orders" 
              class="btn btn-ghost btn-sm h-10 rounded-full font-bold px-4 gap-2 text-primary hover:bg-primary/10 transition-all"
            >
              <span class="material-symbols-outlined text-sm">receipt_long</span>
              PESANAN SAYA
            </NuxtLink>
            <NuxtLink 
              v-if="user"
              to="/jastiper/dashboard" 
              class="btn btn-ghost btn-sm h-10 rounded-full font-bold px-4 gap-2 text-primary hover:bg-primary/10 transition-all border-2 border-primary/20"
            >
              <span class="material-symbols-outlined text-sm">dashboard</span>
              DASHBOARD JASTIPER
            </NuxtLink>
            <button 
              v-if="!user"
              @click="navigateTo('/register')" 
              class="btn btn-secondary btn-sm h-10 rounded-full font-bold px-5 gap-2 shadow-lg shadow-secondary/20 hover:scale-105 transition-transform"
            >
              <span class="material-symbols-outlined text-sm">delivery_dining</span>
              MASUK / DAFTAR JASTIPER
            </button>
          </div>

          <div class="flex items-center gap-1 text-primary">
            <div v-if="user" class="hidden md:flex flex-col items-end mr-2">
              <span class="text-[10px] font-black uppercase tracking-widest opacity-50 leading-none">Jastiper</span>
              <span class="text-xs font-bold text-on-surface">{{ user.name }}</span>
            </div>
            <button v-motion-hover="{ scale: 1.1 }" class="p-2 rounded-full hover:bg-primary/10 relative">
              <span class="material-symbols-outlined">notifications</span>
              <span class="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
            </button>
            <button v-motion-hover="{ scale: 1.1 }" class="p-2 rounded-full hover:bg-primary/10" @click="navigateTo('/profile')">
              <span class="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </ClientOnly>
    </header>

    <!-- Main Content -->
    <main class="flex-grow pt-24 pb-32 px-4 max-w-7xl mx-auto w-full">
      <slot />
    </main>


  </div>
</template>

<script setup>
const { user, syncUser } = useAuth();

onMounted(() => {
  syncUser();
  // Listen for changes from other tabs
  window.addEventListener('storage', (e) => {
    if (e.key === 'jastiper_user') syncUser();
  });
});
</script>

<style scoped>
.router-link-active {
  @apply text-primary;
}
</style>

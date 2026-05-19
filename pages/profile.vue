<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-20">
    <div class="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl shadow-primary-container/10 border border-outline-variant/30 text-center space-y-6">
      <div class="w-32 h-32 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/10 border-4 border-white">
        <span class="material-symbols-outlined text-6xl">person</span>
      </div>
      
      <div v-if="user" class="space-y-2">
        <h1 class="text-4xl font-black text-on-surface font-plus-jakarta italic tracking-tighter">{{ user.name }}</h1>
        <div class="flex flex-col items-center gap-1">
          <p class="text-on-surface-variant font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm">shield_person</span>
            Jastiper ID: #{{ user.id }}
          </p>
          <p class="text-on-surface-variant font-bold text-xs flex items-center justify-center gap-2">
            <span class="material-symbols-outlined text-sm">phone</span>
            {{ user.phone || 'Nomor HP Belum diisi' }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4 pt-4">
        <div class="bg-surface-container/50 p-6 rounded-[2rem] border border-outline-variant/20">
          <div class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Status</div>
          <div class="text-lg font-black text-green-600">Active</div>
        </div>
        <div class="bg-surface-container/50 p-6 rounded-[2rem] border border-outline-variant/20">
          <div class="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Badge</div>
          <div class="text-lg font-black text-primary">Power Jastiper</div>
        </div>
      </div>

      <div class="space-y-3 pt-6">
        <button @click="handleLogout" class="btn btn-error btn-outline w-full rounded-full gap-2 font-bold transition-all hover:bg-error hover:text-white">
          <span class="material-symbols-outlined">logout</span>
          Keluar dari Akun
        </button>
      </div>
    </div>

    <!-- Additional Info Section -->
    <div v-if="user" class="bg-surface-container/30 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-outline-variant/20 space-y-6">
      <h2 class="text-xl font-bold px-2">Account Settings</h2>
      <div class="space-y-2">
        <div @click="navigateTo('/jastiper/change-pin')" class="flex justify-between items-center bg-white p-4 rounded-2xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
           <div class="flex items-center gap-3">
             <span class="material-symbols-outlined text-primary">lock</span>
             <span class="font-bold text-sm">Ganti PIN</span>
           </div>
           <span class="material-symbols-outlined text-sm">chevron_right</span>
        </div>
        <div @click="navigateTo('/jastiper/edit-profile')" class="flex justify-between items-center bg-white p-4 rounded-2xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
           <div class="flex items-center gap-3">
             <span class="material-symbols-outlined text-primary">smartphone</span>
             <span class="font-bold text-sm">Ubah Nomor WhatsApp</span>
           </div>
           <span class="material-symbols-outlined text-sm">chevron_right</span>
        </div>
        <div @click="navigateTo('/jastiper/payment-methods')" class="flex justify-between items-center bg-white p-4 rounded-2xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors">
           <div class="flex items-center gap-3">
             <span class="material-symbols-outlined text-primary">wallet</span>
             <span class="font-bold text-sm">Metode Pembayaran</span>
           </div>
           <span class="material-symbols-outlined text-sm">chevron_right</span>
        </div>
        <div @click="navigateTo('/feedback')" class="flex justify-between items-center bg-white p-4 rounded-2xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container transition-colors mt-4">
           <div class="flex items-center gap-3">
             <span class="material-symbols-outlined text-secondary">chat_bubble</span>
             <span class="font-bold text-sm">Beri Masukan Aplikasi</span>
           </div>
           <span class="material-symbols-outlined text-sm">chevron_right</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { user, syncUser, logout } = useAuth();
const { getUser } = useApi();

onMounted(async () => {
  syncUser();
  if (!user.value) {
    navigateTo('/register');
  } else {
    try {
      const freshUser = await getUser(user.value.id);
      if (freshUser && freshUser.phone) {
        // Update user ref and local storage
        user.value = { ...user.value, phone: freshUser.phone };
        localStorage.setItem('jastiper_user', JSON.stringify(user.value));
      }
    } catch (e) {
      console.error('Failed to fetch fresh user data:', e);
    }
  }
});

const handleLogout = () => {
  if (confirm('Yakin ingin keluar? Semua data sesi kamu tetap di server, tapi di perangkat ini akan logout.')) {
    logout();
    navigateTo('/');
  }
};
</script>

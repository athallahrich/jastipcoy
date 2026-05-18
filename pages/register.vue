<template>
  <div class="max-w-xl mx-auto space-y-12 py-10">
    <!-- Header Section -->
    <div class="text-center space-y-4">
      <h1 class="text-5xl font-extrabold text-primary font-plus-jakarta italic tracking-tighter">
        {{ isLogin ? 'Masuk Akun Jastiper!' : 'Akses Akun Jastiper! 🚀' }}
      </h1>
      <p class="text-on-surface-variant leading-relaxed font-medium">
        {{ isLogin ? 'Masukkan Nama dan PIN Anda untuk masuk.' : 'Masuk atau daftar baru dalam hitungan detik. Cukup Nama dan PIN saja!' }}
      </p>
    </div>

    <!-- Form Section -->
    <div class="bg-white p-10 rounded-[3.5rem] shadow-2xl shadow-primary-container/10 border-4 border-primary/10 relative overflow-hidden">
      <div class="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
      
      <form class="space-y-8 relative z-10" @submit.prevent="handleSubmit">
        <div class="space-y-6">
          <div class="form-control w-full">
            <label class="label"><span class="label-text font-black text-on-surface-variant uppercase tracking-widest text-xs">Nama Terkeren Kamu</span></label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary text-2xl">face</span>
              <input 
                v-model="form.name"
                type="text" 
                placeholder="Siapa namamu?" 
                class="input input-lg input-bordered w-full pl-14 bg-surface-container-lowest border-2 focus:border-primary transition-all rounded-[1.5rem] font-bold" 
                required 
              />
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-black text-on-surface-variant uppercase tracking-widest text-xs">PIN Rahasia</span></label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary text-2xl">key</span>
              <input 
                v-model="form.pin"
                type="password" 
                placeholder="Masukkan PIN" 
                class="input input-lg input-bordered w-full pl-14 bg-surface-container-lowest border-2 focus:border-primary transition-all rounded-[1.5rem] font-bold tracking-[0.5em]" 
                required 
              />
            </div>
          </div>

          <!-- Input WhatsApp hanya muncul jika BUKAN mode Login -->
          <div class="form-control w-full" v-if="!isLogin">
            <label class="label"><span class="label-text font-black text-on-surface-variant uppercase tracking-widest text-xs">Nomor WhatsApp</span></label>
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary text-2xl z-10">call</span>
              <div class="absolute left-14 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant z-10">+62</div>
              <input 
                v-model="form.phone"
                type="tel" 
                placeholder="812345..."
                class="input input-lg input-bordered w-full pl-24 bg-surface-container-lowest border-2 focus:border-primary transition-all rounded-[1.5rem] font-bold"
                :required="!isLogin" 
              />
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button 
            type="submit" 
            :disabled="isLoading"
            class="btn btn-primary btn-xl w-full rounded-full h-20 text-2xl font-black italic tracking-tighter gap-4 shadow-2xl shadow-primary/40 group"
          >
            <span v-if="isLoading" class="loading loading-spinner"></span>
            <span v-else>{{ isLogin ? 'MASUK' : 'DAFTAR' }}</span>
            <span class="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform">bolt</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Info Footer / Toggle Mode -->
    <div class="text-center">
      <p class="text-on-surface-variant/60 font-medium text-sm mb-2">
        {{ isLogin ? 'Belum punya akun?' : 'Nama & PIN sudah terdaftar?' }}
      </p>
      <button 
        @click="isLogin = !isLogin" 
        class="text-primary font-bold hover:underline focus:outline-none"
      >
        {{ isLogin ? 'Daftar Akun Baru di Sini' : 'Masuk ke Dashboard di Sini' }}
      </button>
    </div>
  </div>
</template>

<script setup>
const { registerJastiper } = useApi();
const { login } = useAuth();
const isLoading = ref(false);
const isLogin = ref(false); // State untuk menentukan mode

const form = ref({
  name: '',
  pin: '',
  phone: ''
});

const handleSubmit = async () => {
  try {
    isLoading.value = true;
    
    let payload = {
      name: form.value.name,
      pin: form.value.pin
    };

    // Jika mode daftar, tambahkan dan format nomor telepon
    if (!isLogin.value) {
      let phone = form.value.phone.trim();
      if (phone.startsWith('0')) {
        phone = phone.substring(1);
      }
      payload.phone = '62' + phone;
    }
    
    // Panggil API (asumsi endpoint backend bisa menangani keduanya atau mengabaikan phone saat login)
    const res = await registerJastiper(payload);
    
    // Simpan user info dan update reactive state
    login(res.user);
    
    // Feedback
    alert(isLogin.value ? 'Berhasil Masuk!' : 'Pendaftaran Berhasil!');
    navigateTo('/jastiper/dashboard');
  } catch (error) {
    alert(isLogin.value ? 'Oops! Gagal masuk. Cek kembali Nama dan PIN Anda.' : 'Oops! Gagal daftar. Coba lagi ya!');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-extrabold text-primary font-plus-jakarta italic tracking-tighter">Ganti PIN ✨</h1>
      <p class="text-on-surface-variant font-medium">Jaga keamanan akun jastipmu!</p>
    </div>

    <div class="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary-container/10 border border-outline-variant/30 space-y-8">
      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div class="form-control">
          <label class="label font-bold text-on-surface-variant text-sm px-2">PIN Baru (Min 4 digit)</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">key</span>
            <input 
              v-model="newPin" 
              type="password" 
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="6"
              placeholder="Masukkan PIN baru" 
              class="input input-bordered input-lg w-full pl-12 bg-surface focus:border-primary rounded-2xl border-2 font-bold" 
              required 
            />
          </div>
        </div>

        <div class="form-control">
          <label class="label font-bold text-on-surface-variant text-sm px-2">Konfirmasi PIN</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
            <input 
              v-model="confirmPin" 
              type="password" 
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="6"
              placeholder="Ulangi PIN baru" 
              class="input input-bordered input-lg w-full pl-12 bg-surface focus:border-primary rounded-2xl border-2 font-bold" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading || newPin.length < 4 || newPin !== confirmPin"
          class="btn btn-primary btn-lg w-full rounded-full shadow-xl shadow-primary/30 font-black italic mt-4"
        >
          <span v-if="isLoading" class="loading loading-spinner"></span>
          SIMPAN PIN BARU 🚀
        </button>
      </form>

      <button @click="navigateTo('/profile')" class="btn btn-ghost w-full rounded-full gap-2 font-bold">
        <span class="material-symbols-outlined">arrow_back</span>
        Kembali
      </button>
    </div>
  </div>
</template>

<script setup>
const { updateProfile } = useApi();
const { login } = useAuth();
const newPin = ref('');
const confirmPin = ref('');
const isLoading = ref(false);

const handleUpdate = async () => {
  try {
    isLoading.value = true;
    const user = JSON.parse(localStorage.getItem('jastiper_user'));
    await updateProfile({
      id: user.id,
      pin: newPin.value
    });
    
    // Update local storage and reactive state
    user.pin = newPin.value;
    login(user);
    
    alert('PIN berhasil diperbarui! ✨');
    navigateTo('/profile');
  } catch (error) {
    alert('Gagal memperbarui PIN.');
  } finally {
    isLoading.value = false;
  }
};
</script>

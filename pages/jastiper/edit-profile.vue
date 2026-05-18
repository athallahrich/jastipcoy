<template>
  <div class="max-w-md mx-auto space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-extrabold text-primary font-plus-jakarta italic tracking-tighter">Ubah No. WA 📱</h1>
      <p class="text-on-surface-variant font-medium">Pastikan nomor kamu aktif untuk dihubungi!</p>
    </div>

    <div class="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary-container/10 border border-outline-variant/30 space-y-8">
      <form @submit.prevent="handleUpdate" class="space-y-6">
        <div class="form-control">
          <label class="label font-bold text-on-surface-variant text-sm px-2">Nomor WhatsApp Baru</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">phone</span>
            <input 
              v-model="phone" 
              type="text" 
              inputmode="numeric"
              pattern="[0-9]*"
              placeholder="Contoh: 08123456789" 
              class="input input-bordered input-lg w-full pl-12 bg-surface focus:border-primary rounded-2xl border-2 font-bold" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          :disabled="isLoading || !phone"
          class="btn btn-primary btn-lg w-full rounded-full shadow-xl shadow-primary/30 font-black italic mt-4"
        >
          <span v-if="isLoading" class="loading loading-spinner"></span>
          SIMPAN NOMOR BARU 🚀
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
const { user, syncUser, login } = useAuth();
const phone = ref('');
const isLoading = ref(false);

onMounted(() => {
  syncUser();
  if (!user.value) {
    navigateTo('/register');
  } else {
    phone.value = user.value.phone || '';
  }
});

const handleUpdate = async () => {
  try {
    isLoading.value = true;
    await updateProfile({
      id: user.value.id,
      phone: phone.value
    });
    
    // Update local storage and reactive state
    const updatedUser = { ...user.value, phone: phone.value };
    login(updatedUser);
    
    alert('Nomor WhatsApp berhasil diperbarui! ✨');
    navigateTo('/profile');
  } catch (error) {
    alert('Gagal memperbarui nomor WhatsApp.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-20">
    <div class="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary-container/10 border border-outline-variant/30 text-center space-y-6">
      <div class="w-32 h-32 bg-primary-container text-primary rounded-full flex items-center justify-center mx-auto shadow-xl shadow-primary/10 border-4 border-white">
        <span class="material-symbols-outlined text-6xl">chat_bubble</span>
      </div>
      
      <div class="space-y-2">
        <h1 class="text-4xl font-black text-on-surface font-plus-jakarta italic tracking-tighter">Beri Masukan</h1>
        <p class="text-on-surface-variant font-medium leading-relaxed">
          Punya ide, saran, atau menemukan bug? Kasih tahu kami di sini biar aplikasi JastipCoyy makin kece! ✨
        </p>
      </div>

      <form @submit.prevent="submit" class="space-y-6 pt-4 text-left">
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-bold text-on-surface-variant">Kategori Masukan</span>
          </label>
          <select v-model="form.type" class="select select-bordered w-full rounded-2xl bg-surface-container/30 border-none ring-2 ring-primary/10 focus:ring-primary focus:outline-none">
            <option value="general">Saran / Ide Baru</option>
            <option value="bug">Laporan Bug / Error</option>
            <option value="complaint">Keluhan</option>
            <option value="other">Lainnya</option>
          </select>
        </div>

        <div class="form-control w-full">
          <label class="label">
            <span class="label-text font-bold text-on-surface-variant">Pesan Kamu</span>
          </label>
          <textarea v-model="form.message" class="textarea textarea-bordered h-32 w-full rounded-2xl bg-surface-container/30 border-none ring-2 ring-primary/10 focus:ring-primary focus:outline-none resize-none" placeholder="Ceritain dong detailnya di sini..."></textarea>
        </div>

        <button type="submit" class="btn btn-primary w-full rounded-full gap-2 shadow-lg shadow-primary/30 text-lg h-14" :disabled="loading || !form.message">
          <span class="material-symbols-outlined">{{ loading ? 'hourglass_empty' : 'send' }}</span>
          {{ loading ? 'Mengirim...' : 'Kirim Masukan' }}
        </button>
      </form>
      
      <div v-if="successMsg" class="alert alert-success rounded-2xl flex items-center justify-center mt-4">
        <span class="material-symbols-outlined text-white">check_circle</span>
        <span class="font-bold text-white">{{ successMsg }}</span>
      </div>
      <div v-if="errorMsg" class="alert alert-error rounded-2xl flex items-center justify-center mt-4">
        <span class="material-symbols-outlined text-white">error</span>
        <span class="font-bold text-white">{{ errorMsg }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const { submitFeedback } = useApi();
const { user, syncUser } = useAuth();

onMounted(() => {
  syncUser();
});

const form = ref({
  type: 'general',
  message: ''
});

const loading = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const submit = async () => {
  if (!form.value.message.trim()) return;
  loading.value = true;
  successMsg.value = '';
  errorMsg.value = '';
  
  try {
    const payload = {
      user_id: user.value ? user.value.id : null,
      type: form.value.type,
      message: form.value.message
    };
    
    await submitFeedback(payload);
    
    successMsg.value = 'Makasih banyak ya masukannya! Bakal kami proses biar JastipCoyy makin oke.';
    form.value.message = '';
    
    // Clear message after 3 seconds
    setTimeout(() => {
      successMsg.value = '';
      navigateTo('/profile');
    }, 3000);
    
  } catch (e) {
    errorMsg.value = 'Waduh, gagal ngirim nih. Coba lagi ya.';
  } finally {
    loading.value = false;
  }
};
</script>

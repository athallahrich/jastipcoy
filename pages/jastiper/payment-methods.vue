<template>
  <div class="max-w-2xl mx-auto space-y-8 pb-20">
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-extrabold text-primary font-plus-jakarta italic tracking-tighter">Metode Pembayaran 💳</h1>
      <p class="text-on-surface-variant font-medium">Atur cara pembeli membayarmu!</p>
    </div>

    <div class="bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary-container/10 border border-outline-variant/30 space-y-8">
      <div class="space-y-6">
        <div v-for="(method, idx) in paymentMethods" :key="idx" class="bg-surface-container/50 p-6 rounded-[2rem] border border-outline-variant/20 relative group">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
                <div class="bg-white p-3 rounded-2xl shadow-sm border border-outline-variant/20">
                    <span class="material-symbols-outlined text-primary">{{ getIcon(method.type) }}</span>
                </div>
                <select v-model="method.type" class="select select-bordered select-sm rounded-xl font-bold bg-white">
                    <option value="bank">Transfer Bank</option>
                    <option value="wallet">E-Wallet</option>
                    <option value="qr">QR Code / QRIS</option>
                </select>
            </div>
            <button @click="removeMethod(idx)" class="btn btn-ghost btn-sm btn-circle text-error opacity-0 group-hover:opacity-100 transition-opacity">
               <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
          
          <div v-if="method.type !== 'qr'" class="grid grid-cols-1 gap-4">
            <input v-model="method.provider" placeholder="Nama Bank / E-Wallet (e.g. BCA, OVO)" class="input input-bordered input-sm rounded-xl font-bold" />
            <input v-model="method.account_name" placeholder="Nama Pemilik Rekening" class="input input-bordered input-sm rounded-xl font-medium" />
            <input v-model="method.account_number" placeholder="Nomor Rekening / HP" class="input input-bordered input-sm rounded-xl font-mono" />
          </div>

          <div v-else class="space-y-4">
            <input v-model="method.provider" placeholder="Nama Layanan (e.g. QRIS, Dana QR)" class="input input-bordered input-sm w-full rounded-xl font-bold" />
            <div class="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl border-2 border-dashed border-outline-variant/30">
                <img v-if="method.qr_data" :src="method.qr_data" class="w-40 h-40 object-contain rounded-lg shadow-md" />
                <div v-else class="text-center py-6">
                    <span class="material-symbols-outlined text-4xl text-outline-variant">qr_code_2</span>
                    <p class="text-xs font-bold text-on-surface-variant mt-2 uppercase tracking-widest">Belum ada QR</p>
                </div>
                <input type="file" accept="image/*" class="file-input file-input-bordered file-input-sm w-full rounded-xl" @change="(e) => handleQrUpload(e, idx)" />
                <p class="text-[10px] text-on-surface-variant text-center leading-tight">Upload screenshot QRIS atau QR Code kamu di sini.</p>
            </div>
          </div>
        </div>

        <button @click="addMethod" class="btn btn-outline btn-primary w-full border-dashed rounded-2xl gap-2">
          <span class="material-symbols-outlined">add</span>
          Tambah Metode Baru
        </button>
      </div>

      <div class="flex flex-col gap-3 pt-4">
        <button 
          @click="handleSave" 
          :disabled="isLoading"
          class="btn btn-primary btn-lg w-full rounded-full shadow-xl shadow-primary/30 font-black italic"
        >
          <span v-if="isLoading" class="loading loading-spinner"></span>
          SIMPAN METODE 🚀
        </button>
        <button @click="navigateTo('/profile')" class="btn btn-ghost w-full rounded-full gap-2 font-bold">
          <span class="material-symbols-outlined">arrow_back</span>
          Kembali
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getPaymentMethods, addPaymentMethod, deletePaymentMethod } = useApi();
const paymentMethods = ref([]);
const isLoading = ref(false);
const methodsToDelete = ref([]);

const getIcon = (type) => {
    if (type === 'qr') return 'qr_code_2';
    if (type === 'bank') return 'account_balance';
    return 'account_balance_wallet';
};

const addMethod = () => {
    paymentMethods.value.push({ type: 'bank', provider: '', account_name: '', account_number: '', qr_data: null, is_new: true });
};

const removeMethod = (idx) => {
    const method = paymentMethods.value[idx];
    if (!method.is_new) {
        methodsToDelete.value.push(method.id);
    }
    paymentMethods.value.splice(idx, 1);
};

const handleQrUpload = (e, idx) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            paymentMethods.value[idx].qr_data = event.target.result;
        };
        reader.readAsDataURL(file);
    }
};

onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem('jastiper_user'));
    const data = await getPaymentMethods(user.id);
    paymentMethods.value = data;
    if (paymentMethods.value.length === 0) {
        addMethod();
    }
  } catch (error) {
    console.error('Failed to fetch payment methods', error);
  }
});

const handleSave = async () => {
  try {
    isLoading.value = true;
    const user = JSON.parse(localStorage.getItem('jastiper_user'));
    
    // Delete methods marked for deletion
    for (const id of methodsToDelete.value) {
        await deletePaymentMethod(id);
    }
    methodsToDelete.value = [];

    // Save only changed or new methods
    for (const method of paymentMethods.value) {
        if (method.is_new) {
            delete method.is_new;
            method.user_id = user.id;
            await addPaymentMethod(method);
        } else {
            // we could add update here, but for now we focus on creating
        }
    }
    
    alert('Metode pembayaran berhasil disinkronkan! ✨');
    // Refresh list
    const data = await getPaymentMethods(user.id);
    paymentMethods.value = data;
    navigateTo('/profile');
  } catch (error) {
    alert('Gagal menyimpan metode pembayaran.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-3xl mx-auto space-y-12">
    <!-- Success View -->
    <div v-if="successData" class="text-center space-y-8 py-10" v-motion :initial="{ scale: 0.9, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }">
      <div class="w-32 h-32 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200">
        <span class="material-symbols-outlined text-6xl fill">check_circle</span>
      </div>
      <div class="space-y-4">
        <h1 class="text-5xl font-black text-on-surface font-plus-jakarta italic tracking-tighter">Berhasil Diluncurkan! 🚀</h1>
        <p class="text-on-surface-variant font-medium">Jasa jastip kamu sudah aktif. Sekarang bagikan link di bawah ini ke teman-temanmu!</p>
      </div>

      <div class="bg-white p-8 rounded-[3rem] shadow-2xl shadow-primary-container/10 border-4 border-primary/20 space-y-6 max-w-md mx-auto">
        <div class="bg-surface-container p-4 rounded-2xl font-mono text-sm break-all select-all border-2 border-primary/10">
          {{ shareLink }}
        </div>
        <button 
          @click="copyLink"
          class="btn btn-primary btn-lg w-full rounded-full gap-3 font-bold"
        >
          <span class="material-symbols-outlined">content_copy</span>
          {{ copyStatus }}
        </button>
      </div>

      <div class="flex justify-center gap-4">
        <button @click="navigateTo('/jastiper/dashboard')" class="btn btn-ghost rounded-full">Ke Dashboard</button>
        <button @click="successData = null; currentStep = 1" class="btn btn-secondary rounded-full">Buka Lagi Baru ✨</button>
      </div>
    </div>

    <!-- Form View -->
    <div v-else class="space-y-12">
      <div class="text-center space-y-2">
        <h1 class="text-5xl font-extrabold text-primary font-plus-jakarta italic tracking-tighter">Buka Jastip Baru ✨</h1>
        <p class="text-on-surface-variant font-medium">Isi detailnya dan mulai kumpulkan pesanan!</p>
      </div>

      <div class="bg-white rounded-[3rem] shadow-2xl shadow-primary-container/10 p-8 md:p-12 border border-outline-variant/30">
        <div class="flex items-center justify-between mb-12 relative px-4">
          <div class="absolute top-5 left-12 right-12 h-1 bg-surface-container -z-0">
            <div class="h-full bg-primary transition-all duration-500" :style="{ width: progressWidth }"></div>
          </div>
          <div v-for="step in steps" :key="step.id" class="flex flex-col items-center gap-2 relative z-10 transition-colors" :class="currentStep >= step.id ? 'text-primary' : 'text-on-surface-variant'">
            <div :class="['w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-2 transition-all', currentStep >= step.id ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white border-surface-container text-on-surface-variant']">
              {{ step.id }}
            </div>
            <span class="text-[10px] font-bold uppercase tracking-widest">{{ step.name }}</span>
          </div>
        </div>

        <form @submit.prevent="handleLaunch" novalidate>
          <ClientOnly>
            <!-- Step 1: Details -->
            <div v-show="currentStep === 1" class="space-y-8">
              <h2 class="text-2xl font-bold text-on-surface flex items-center gap-2 border-b-2 border-primary-container/20 pb-4">
                <span class="material-symbols-outlined text-primary fill">storefront</span>
                Detail Jastip
              </h2>

              <div class="form-control">
                <label class="label font-bold text-on-surface-variant text-sm">Kamu mau beli apa? (Judul)</label>
                <input v-model="form.title" type="text" placeholder="Contoh: Starbucks Run Kemang" class="input input-bordered input-lg bg-surface focus:border-primary rounded-2xl border-2 font-bold" required />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="form-control">
                  <label class="label font-bold text-on-surface-variant text-sm">Fee Jastip (Rp)</label>
                  <input v-model="form.fee" type="number" placeholder="Contoh: 5000" class="input input-bordered bg-surface focus:border-primary rounded-2xl border-2 font-bold" required />
                </div>
                <div class="form-control">
                  <label class="label font-bold text-on-surface-variant text-sm">Berapa Slot? (Max)</label>
                  <input v-model="form.total_slots" type="number" class="input input-bordered bg-surface focus:border-primary rounded-2xl border-2 font-bold" required />
                </div>
                <div class="form-control">
                  <label class="label font-bold text-on-surface-variant text-sm">Jam Tutup?</label>
                  <input v-model="form.closing_time" type="text" placeholder="Contoh: 23:59" class="input input-bordered bg-surface focus:border-primary rounded-2xl border-2 font-bold" required pattern="([01]?[0-9]|2[0-3]):[0-5][0-9]" title="Format waktu harus 24 jam (HH:mm), contoh: 23:59" />
                </div>
              </div>

              <div class="form-control">
                <div class="flex justify-between items-center mb-2">
                  <label class="label font-bold text-on-surface-variant text-sm p-0">Pilih Lokasi Pengantaran</label>
                  <button type="button" @click="isAddingLocation = !isAddingLocation" class="btn btn-xs btn-primary rounded-full gap-1">
                    <span class="material-symbols-outlined text-[14px]">{{ isAddingLocation ? 'close' : 'add' }}</span>
                    {{ isAddingLocation ? 'Batal' : 'Lokasi Baru' }}
                  </button>
                </div>

                <!-- Add Location Form -->
                <div v-if="isAddingLocation" class="bg-surface-container/50 p-4 rounded-2xl border-2 border-dashed border-primary/20 mb-4 space-y-4 shadow-inner" v-motion :initial="{ height: 0, opacity: 0 }" :enter="{ height: 'auto', opacity: 1 }">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input v-model="newSpot.name" type="text" placeholder="Nama Lokasi (Tower B, dsb)" class="input input-sm input-bordered rounded-xl" />
                    <input v-model="newSpot.sub_name" type="text" placeholder="Detail (Dekat Lobby)" class="input input-sm input-bordered rounded-xl" />
                  </div>
                  <button type="button" @click="addNewLocation" class="btn btn-primary btn-sm w-full rounded-xl shadow-lg shadow-primary/20 font-bold">Simpan & Pilih ✨</button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div 
                    v-for="loc in locationsList" 
                    :key="loc.id"
                    @click="form.location_id = loc.id"
                    class="p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 font-bold"
                    :class="form.location_id === loc.id ? 'border-primary bg-primary/5 text-primary shadow-md' : 'border-outline-variant/30 hover:border-primary/30 text-on-surface-variant hover:bg-surface-container/30'"
                  >
                    <span class="material-symbols-outlined">{{ loc.icon || 'location_on' }}</span>
                    <div class="leading-tight">
                      <div class="text-sm">{{ loc.name }}</div>
                      <div class="text-[10px] opacity-60 font-medium">{{ loc.sub_name }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 2: Menu Items -->
            <div v-show="currentStep === 2" class="space-y-8">
              <h2 class="text-2xl font-bold text-on-surface flex items-center gap-2 border-b-2 border-primary-container/20 pb-4">
                <span class="material-symbols-outlined text-primary fill">list_alt</span>
                Menu / Daftar Barang
              </h2>
              
              <div class="space-y-4">
                <div v-for="(item, idx) in menuItems" :key="idx" class="flex gap-2 items-end bg-surface-container/30 p-4 rounded-2xl border border-outline-variant/20">
                  <div class="flex-1 space-y-2">
                    <label class="text-[10px] font-black uppercase text-on-surface-variant px-2">Nama Barang</label>
                    <input v-model="item.name" placeholder="Item name" class="input input-bordered input-sm w-full rounded-xl" required />
                  </div>
                  <div class="w-32 space-y-2">
                    <label class="text-[10px] font-black uppercase text-on-surface-variant px-2">Harga</label>
                    <input v-model="item.price" type="number" placeholder="Price" class="input input-bordered input-sm w-full rounded-xl" required />
                  </div>
                  <button type="button" @click="removeItem(idx)" class="btn btn-ghost btn-sm btn-circle text-error mb-1">
                    <span class="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>

              <button type="button" @click="addItem" class="btn btn-outline btn-primary w-full border-dashed rounded-2xl gap-2 mt-4">
                <span class="material-symbols-outlined">add</span>
                Tambah Item Menu
              </button>
            </div>
            
            <!-- Step 3: Payment Preview -->
            <div v-show="currentStep === 3" class="space-y-8">
              <h2 class="text-2xl font-bold text-on-surface flex items-center gap-2 border-b-2 border-primary-container/20 pb-4">
                <span class="material-symbols-outlined text-primary fill">payments</span>
                Metode Pembayaran
              </h2>

              <p class="text-sm font-medium text-on-surface-variant mb-4">Metode pembayaran berikut akan tampil untuk pembeli kamu:</p>
              
              <div v-if="paymentMethods.length > 0" class="space-y-3">
                 <div v-for="pm in paymentMethods" :key="pm.id" class="p-4 rounded-2xl border-2 border-outline-variant/30 flex items-center justify-between bg-surface-container/30">
                    <div class="flex items-center gap-3">
                       <span class="material-symbols-outlined text-primary">{{ getIcon(pm.type) }}</span>
                       <div>
                          <div class="font-black text-sm">{{ pm.provider || pm.type.toUpperCase() }}</div>
                          <div class="text-[10px] font-bold text-on-surface-variant opacity-60">{{ pm.account_name }} - {{ pm.account_number }}</div>
                       </div>
                    </div>
                 </div>
                 <button type="button" @click="showAddPaymentModal = true" class="btn btn-outline btn-primary btn-sm w-full border-dashed rounded-full gap-2 mt-4">
                   <span class="material-symbols-outlined">add</span>
                   Tambah Metode Lain
                 </button>
              </div>
              <div v-else class="text-center py-10 bg-error/5 rounded-3xl border-2 border-dashed border-error/20">
                 <p class="text-error font-bold mb-2">Kamu belum menambahkan metode pembayaran!</p>
                 <button type="button" @click="showAddPaymentModal = true" class="btn btn-error btn-sm rounded-full">Tambah Sekarang</button>
              </div>
            </div>

            <!-- Step 4: Confirmation -->
            <div v-show="currentStep === 4" class="space-y-8 text-center py-6">
              <div class="w-24 h-24 bg-primary-container/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <span class="material-symbols-outlined text-6xl fill">rocket_launch</span>
              </div>
              <h2 class="text-4xl font-black text-on-surface italic tracking-tighter">Siap Luncurkan?</h2>
              <p class="text-on-surface-variant font-medium">Cek lagi detail jastip kamu ya!</p>
              
              <div class="bg-surface-container/50 p-8 rounded-[2.5rem] text-left space-y-4 max-w-md mx-auto border-2 border-primary/5 font-bold">
                <div class="flex justify-between items-center"><span class="text-on-surface-variant text-xs uppercase opacity-50">Produk</span><span class="text-on-surface">{{ form.title }}</span></div>
                <div class="flex justify-between items-center"><span class="text-on-surface-variant text-xs uppercase opacity-50">Menu</span><span class="text-on-surface">{{ menuItems.length }} Item</span></div>
                <div class="flex justify-between items-center"><span class="text-on-surface-variant text-xs uppercase opacity-50">Slot</span><span class="text-on-surface">{{ form.total_slots }} Orang</span></div>
                <div class="flex justify-between items-center"><span class="text-on-surface-variant text-xs uppercase opacity-50">Lokasi</span><span class="text-on-surface">{{ selectedLocationName }}</span></div>
              </div>
            </div>
          </ClientOnly>

          <div class="flex gap-4 mt-12 pt-8 border-t border-outline-variant/30">
            <button v-if="currentStep > 1" type="button" @click="currentStep--" class="btn btn-ghost rounded-full px-8 font-bold">Kembali</button>
            <button v-if="currentStep < 4" type="button" @click="nextStep" :disabled="currentStep === 3 && paymentMethods.length === 0" class="btn btn-primary flex-1 rounded-full px-8 font-bold">Lanjut</button>
            <button v-else type="submit" :disabled="isLoading" class="btn btn-primary flex-1 rounded-full px-8 font-black text-lg italic shadow-xl shadow-primary/30">
              <span v-if="isLoading" class="loading loading-spinner"></span>
              <span v-else>LUNCURKAN JASTIP! 🚀</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Add Payment Modal -->
      <Teleport to="body">
        <div v-if="showAddPaymentModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div class="bg-white rounded-[2rem] w-full max-w-md p-8 space-y-6 shadow-2xl">
            <h3 class="text-2xl font-bold text-on-surface">Tambah Pembayaran</h3>
            
            <div class="space-y-4">
               <select v-model="newPayment.type" class="select select-bordered w-full rounded-xl font-bold">
                   <option value="bank">Transfer Bank</option>
                   <option value="wallet">E-Wallet</option>
                   <option value="qr">QR Code / QRIS</option>
               </select>
               
               <template v-if="newPayment.type !== 'qr'">
                  <input v-model="newPayment.provider" placeholder="Nama Bank/E-Wallet (e.g. BCA)" class="input input-bordered w-full rounded-xl" />
                  <input v-model="newPayment.account_name" placeholder="Atas Nama" class="input input-bordered w-full rounded-xl" />
                  <input v-model="newPayment.account_number" placeholder="Nomor Rekening/HP" class="input input-bordered w-full rounded-xl" />
               </template>
               <template v-else>
                  <input v-model="newPayment.provider" placeholder="Nama Layanan (e.g. QRIS)" class="input input-bordered w-full rounded-xl" />
                  <div class="border-2 border-dashed border-outline-variant/30 rounded-xl p-4 text-center space-y-2">
                     <img v-if="newPayment.qr_data" :src="newPayment.qr_data" class="h-32 mx-auto object-contain" />
                     <input type="file" accept="image/*" class="file-input file-input-bordered file-input-sm w-full" @change="handleQrUpload" />
                  </div>
               </template>
            </div>
            
            <div class="flex gap-3 pt-2">
               <button type="button" @click="showAddPaymentModal = false" class="btn btn-ghost flex-1 rounded-full">Batal</button>
               <button type="button" @click="saveNewPayment" :disabled="isSavingPayment" class="btn btn-primary flex-1 rounded-full">
                  <span v-if="isSavingPayment" class="loading loading-spinner"></span>
                  Simpan
               </button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth-jastiper'
});

const { getLocations, createLocation, createSession, addPaymentMethod, getPaymentMethods } = useApi();
const currentStep = ref(1);
const isLoading = ref(false);
const successData = ref(null);
const copyStatus = ref('Copy Link');
const paymentMethods = ref([]);

const steps = [
  { id: 1, name: 'Detail' },
  { id: 2, name: 'Menu' },
  { id: 3, name: 'Payment' },
  { id: 4, name: 'Launch' }
];

const locationsList = ref([]);
const isAddingLocation = ref(false);
const newSpot = ref({ name: '', sub_name: '' });

const loadLocations = async () => {
  try {
    const data = await getLocations();
    locationsList.value = data;
    if (data.length > 0 && !form.value.location_id) {
       form.value.location_id = data[0].id;
    }
  } catch (error) {
    console.error('Failed to load locations');
  }
};

const addNewLocation = async () => {
    if (!newSpot.value.name) return;
    try {
        const res = await createLocation({
            name: newSpot.value.name,
            sub_name: newSpot.value.sub_name,
            icon: 'location_on'
        });
        await loadLocations();
        form.value.location_id = res.id; // Select the newly created location
        isAddingLocation.value = false;
        newSpot.value = { name: '', sub_name: '' };
    } catch (error) {
        alert('Gagal menambah lokasi');
    }
};

const loadPaymentMethods = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('jastiper_user'));
        if (user) {
            paymentMethods.value = await getPaymentMethods(user.id);
        }
    } catch (e) {
        console.error('Failed to load payment methods');
    }
};

const getIcon = (type) => {
    if (type === 'qr') return 'qr_code_2';
    if (type === 'bank') return 'account_balance';
    return 'account_balance_wallet';
};

const showAddPaymentModal = ref(false);
const isSavingPayment = ref(false);
const newPayment = ref({ type: 'bank', provider: '', account_name: '', account_number: '', qr_data: null });

const handleQrUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            newPayment.value.qr_data = event.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const saveNewPayment = async () => {
    try {
        if (!newPayment.value.provider) return alert('Nama Bank/Provider wajib diisi!');
        isSavingPayment.value = true;
        const user = JSON.parse(localStorage.getItem('jastiper_user'));
        const payload = { ...newPayment.value, user_id: user.id };
        await addPaymentMethod(payload);
        
        paymentMethods.value = await getPaymentMethods(user.id);
        
        newPayment.value = { type: 'bank', provider: '', account_name: '', account_number: '', qr_data: null };
        showAddPaymentModal.value = false;
    } catch (e) {
        alert('Gagal menyimpan metode pembayaran');
    } finally {
        isSavingPayment.value = false;
    }
};

onMounted(() => {
    loadLocations();
    loadPaymentMethods();
});

const menuItems = ref([
  { id: Date.now(), name: '', price: '' }
]);

const addItem = () => {
    menuItems.value.push({ id: Date.now() + Math.floor(Math.random() * 1000), name: '', price: '' });
};

const removeItem = (idx) => {
    menuItems.value.splice(idx, 1);
};

const form = ref({
  title: '',
  total_slots: '',
  closing_time: '',
  fee: 5000,
  location_id: 1,
  jastiper_id: null,
  menu_json: ''
});



const selectedLocationName = computed(() => {
    const loc = locationsList.value.find(l => l.id === form.value.location_id);
    return loc ? loc.name : '-';
});

const progressWidth = computed(() => `${((currentStep.value - 1) / (steps.length - 1)) * 100}%`);

const nextStep = () => {
    if (currentStep.value === 1) {
        if (!form.value.title) return document.querySelector('input[type="text"]').reportValidity();
        if (!form.value.fee) return document.querySelectorAll('input[type="number"]')[0].reportValidity();
        if (!form.value.total_slots) return document.querySelectorAll('input[type="number"]')[1].reportValidity();
        if (!form.value.closing_time) return document.querySelector('input[type="time"]').reportValidity();
    }
    if (currentStep.value === 2) {
        for (const item of menuItems.value) {
            if (!item.name) {
                return alert('Pastikan semua menu sudah terisi Nama barangnya!');
            }
        }
    }
    if (currentStep.value < 4) {
        currentStep.value++;
    }
};

const shareLink = computed(() => {
  if (!successData.value) return '';
  const origin = window.location.origin;
  return `${origin}/sessions?token=${successData.value.share_token}`;
});

const copyLink = () => {
  navigator.clipboard.writeText(shareLink.value);
  copyStatus.value = 'Copied! ✅';
  setTimeout(() => copyStatus.value = 'Copy Link', 2000);
};

const handleLaunch = async () => {
  try {
    isLoading.value = true;
    const user = JSON.parse(localStorage.getItem('jastiper_user'));
    if (!user) throw new Error('User not registered');
    
    form.value.jastiper_id = user.id;
    form.value.slots_available = form.value.total_slots;
    form.value.menu_json = JSON.stringify(menuItems.value);
    
    const res = await createSession(form.value);
    successData.value = res;
    
  } catch (error) {
    alert('Oops! Gagal meluncurkan jastip. Pastikan kamu sudah daftar ya!');
    navigateTo('/register');
  } finally {
    isLoading.value = false;
  }
};
</script>

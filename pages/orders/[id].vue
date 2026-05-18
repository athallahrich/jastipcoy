<template>
  <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pb-16">
    <div v-if="loading" class="flex-1 flex justify-center py-20">
       <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
    
    <template v-else-if="order">
      <!-- Left Column: Main Content -->
      <div class="flex-1 flex flex-col gap-8">
        <!-- Status Banner -->
        <section v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }" 
          :class="['rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border',
                  statusConfig[order.status || 'pending']?.bg]">
          <div class="flex items-center gap-6">
            <div class="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg shrink-0">
               <span :class="['material-symbols-outlined text-4xl fill', statusConfig[order.status || 'pending']?.color]">
                {{ statusConfig[order.status || 'pending']?.icon }}
              </span>
            </div>
            <div class="text-center md:text-left">
              <h2 :class="['text-3xl font-black font-plus-jakarta mb-1', statusConfig[order.status || 'pending']?.textColor]">
                {{ statusConfig[order.status || 'pending']?.title }}
              </h2>
              <p :class="['font-medium tracking-tight opacity-70', statusConfig[order.status || 'pending']?.textColor]">
                {{ statusConfig[order.status || 'pending']?.message }}
              </p>
            </div>
          </div>
          <div class="text-center md:text-right w-full md:w-auto p-4 md:p-0 bg-white/20 rounded-3xl md:bg-transparent">
            <p class="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Total Amount</p>
            <p :class="['text-4xl font-black font-plus-jakarta', statusConfig[order.status || 'pending']?.textColor]">
               Rp {{ parseInt(order.amount).toLocaleString('id-ID') }}
            </p>
          </div>
        </section>

        <!-- Order Summary Column -->
        <section class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary-container/10 border border-outline-variant/20">
          <div class="flex justify-between items-center mb-8 pb-6 border-b-2 border-surface-container border-dashed">
            <div class="flex flex-col gap-1">
              <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Reference ID</span>
              <span class="font-bold text-on-surface text-lg">#ORDER-{{ order.id }}</span>
            </div>
            <div class="flex flex-col items-end gap-1">
              <span class="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">Merchant</span>
              <span class="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold ring-2 ring-secondary/10">
                {{ order.session_name }}
              </span>
            </div>
          </div>

          <div class="space-y-6">
            <div v-for="(item, idx) in orderItems" :key="idx" class="flex gap-6 items-center p-4 rounded-3xl hover:bg-surface-container/30 transition-colors group">
              <div class="w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                <span class="material-symbols-outlined text-4xl text-outline-variant/30">restaurant</span>
              </div>
              <div class="flex-1">
                <h3 class="font-bold text-on-surface text-lg mb-1">{{ item.name }}</h3>
                <p class="text-on-surface-variant text-sm font-medium">Qty: {{ item.quantity }} x {{ (parseInt(item.price) && !isNaN(parseInt(item.price))) ? ('Rp ' + parseInt(item.price).toLocaleString('id-ID')) : 'Menyusul (Belum Diatur)' }}</p>
                <p v-if="item.note" class="text-xs italic text-on-surface-variant mt-1 bg-surface-container/50 inline-block px-3 py-1 rounded-lg border border-outline-variant/20">Catatan: "{{ item.note }}"</p>
              </div>
              <span class="font-black text-on-surface text-lg font-plus-jakarta">
                {{ (parseInt(item.price) && !isNaN(parseInt(item.price))) ? ('Rp ' + (item.quantity * parseInt(item.price)).toLocaleString('id-ID')) : 'Menyusul' }}
              </span>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t-2 border-surface-container border-dashed flex flex-col gap-3">
            <div class="flex justify-between text-on-surface-variant font-medium">
              <span>Subtotal</span>
              <span>{{ isPriceConfirmed ? ('Rp ' + (parseInt(order.amount) - parseInt(order.session_fee || 5000)).toLocaleString('id-ID')) : 'Menyusul' }}</span>
            </div>
            <div class="flex justify-between text-on-surface-variant font-medium border-b border-surface-container pb-3">
              <span>Jastip Fee</span>
              <span>Rp {{ parseInt(order.session_fee || 5000).toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between text-primary text-3xl font-black font-plus-jakarta pt-2">
              <span>Overall Total</span>
              <span>{{ isPriceConfirmed ? ('Rp ' + parseInt(order.amount).toLocaleString('id-ID')) : 'Menyusul (Menunggu Jastiper)' }}</span>
            </div>
          </div>
        </section>

        <!-- Timeline -->
        <section class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary-container/10 border border-outline-variant/20">
          <h3 class="text-2xl font-bold text-on-surface mb-8 font-plus-jakarta flex items-center gap-2">
            <span class="material-symbols-outlined text-primary">analytics</span>
            Order Timeline
          </h3>
          
          <div class="relative pl-10 space-y-12 before:absolute before:inset-y-2 before:left-4 before:w-1 before:bg-surface-container before:rounded-full">
            <div v-for="step in timelineSteps" :key="step.status" class="relative group" :class="{ 'opacity-30 grayscale': !isStepActive(step.status) }">
              <div :class="['absolute -left-[35px] w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all', 
                           isStepActive(step.status) ? 'bg-primary ring-8 ring-primary-container shadow-lg shadow-primary/20' : 'bg-surface-container border-4 border-outline-variant/20']">
                <span :class="['material-symbols-outlined text-sm', isStepActive(step.status) ? 'text-white' : 'text-on-surface-variant']">
                  {{ step.icon }}
                </span>
                <div v-if="order.status === step.status" class="absolute w-12 h-12 rounded-full border-2 border-primary animate-ping opacity-20"></div>
              </div>
              <div>
                <h4 :class="['text-lg font-bold mb-1', isStepActive(step.status) ? 'text-primary' : 'text-on-surface']">{{ step.title }}</h4>
                <p class="text-on-surface-variant text-sm font-medium">{{ step.message }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Right Column: Sidebar -->
      <aside class="w-full lg:w-[400px] shrink-0">
        <div class="sticky top-24 bg-white rounded-[3rem] p-10 shadow-2xl shadow-primary-container/20 flex flex-col gap-8 border-4 border-primary-container/30 text-center">
          <div v-if="(order.status || 'pending') === 'pending'" class="space-y-6">
            <div class="space-y-2">
              <h2 class="text-3xl font-black text-on-surface font-plus-jakarta italic">Konfirmasi Pembayaran</h2>
              <p class="text-on-surface-variant font-medium text-sm leading-relaxed">
                <span v-if="isPriceConfirmed">Silakan bayar melalui metode di bawah ini dan kirim bukti ke WhatsApp.</span>
                <span v-else class="text-amber-600 font-bold">⚠️ Menunggu Jastiper mengonfirmasi harga pesanan sebelum pembayaran dapat dilakukan.</span>
              </p>
            </div>
            
            <div v-if="!isPriceConfirmed" class="bg-amber-50 rounded-[2rem] p-8 border-2 border-amber-500/20 text-center space-y-4">
              <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full mx-auto flex items-center justify-center shadow-md">
                <span class="material-symbols-outlined text-3xl">hourglass_top</span>
              </div>
              <h3 class="font-black text-amber-900 text-lg">Harga Belum Lengkap</h3>
              <p class="text-xs text-amber-800 leading-relaxed font-medium">Jastiper saat ini sedang mengecek dan melengkapi harga dari pesananmu. Pilihan pembayaran dan tombol konfirmasi akan otomatis aktif setelah semua harga terisi.</p>
            </div>

            <template v-else>
              <div class="bg-surface-container rounded-[2rem] p-6 space-y-4 border-2 border-primary/5">
                <!-- Show Centralized Payment Method if available -->
                <div v-if="order.payment_method_id" class="text-left space-y-4">
                   <div class="flex items-center gap-3">
                     <div class="bg-white p-2 rounded-xl shadow-sm border border-outline-variant/10">
                       <span class="material-symbols-outlined text-primary text-xl">{{ getIcon(order.pm_type) }}</span>
                     </div>
                     <div>
                       <div class="text-[10px] font-black uppercase text-primary/60 leading-none mb-1">{{ order.pm_type }}</div>
                       <div class="font-black text-on-surface">{{ order.pm_provider || 'Payment Method' }}</div>
                     </div>
                   </div>

                   <div v-if="order.pm_type !== 'qr'" class="bg-white p-4 rounded-2xl border-2 border-outline-variant/30 space-y-1">
                      <div class="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-50">Nomor Rekening / HP</div>
                      <div class="text-xl font-black text-on-surface font-mono">{{ order.pm_account_number }}</div>
                      <div class="text-xs font-bold text-on-surface-variant">a/n {{ order.pm_account_name }}</div>
                   </div>

                   <div v-if="order.pm_type === 'qr'" class="flex flex-col items-center gap-4">
                      <img :src="order.pm_qr_data" class="w-full max-w-[200px] aspect-square object-contain bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20" />
                      <p class="text-[10px] font-bold text-on-surface-variant text-center opacity-70">Scan QR untuk bayar</p>
                   </div>
                </div>

                <!-- Show Available Payment Methods from Jastiper -->
                <div v-else-if="paymentMethods.length > 0" class="space-y-4 text-left">
                  <div v-for="(method, idx) in paymentMethods" :key="idx" class="bg-white rounded-3xl p-5 border border-outline-variant/30 space-y-3 shadow-sm">
                     <div class="flex items-center gap-3">
                        <div class="bg-primary-container p-2 rounded-xl text-primary font-black flex items-center justify-center">
                          <span class="material-symbols-outlined text-lg">{{ getIcon(method.type) }}</span>
                        </div>
                        <div>
                          <div class="text-[10px] font-black uppercase text-primary tracking-wider">{{ method.type }}</div>
                          <div class="font-black text-on-surface text-sm">{{ method.provider }}</div>
                        </div>
                     </div>
                     
                     <div v-if="method.type !== 'qr'" class="bg-surface-container/30 p-3 rounded-2xl border border-outline-variant/20 space-y-1">
                        <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Nomor Rekening / HP</div>
                        <div class="text-base font-black text-on-surface font-mono">{{ method.account_number }}</div>
                        <div class="text-xs font-bold text-on-surface-variant">a/n {{ method.account_name }}</div>
                     </div>

                     <div v-else class="flex flex-col items-center gap-3 bg-surface-container/30 p-4 rounded-2xl border border-outline-variant/20">
                        <img :src="method.qr_data" class="w-full max-w-[160px] aspect-square object-contain bg-white rounded-xl p-3 shadow-sm border border-outline-variant/20" />
                        <p class="text-[10px] font-bold text-on-surface-variant text-center opacity-80">Scan QR untuk bayar</p>
                     </div>
                  </div>
                </div>

                <!-- Fallback to session payment_info -->
                <div v-else-if="order.payment_info" class="text-left">
                  <p class="whitespace-pre-line font-bold text-on-surface leading-snug">{{ order.payment_info }}</p>
                </div>
                
                <div v-else class="space-y-4">
                   <div class="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center shadow-inner">
                      <span class="material-symbols-outlined text-4xl text-primary/20">qr_code_2</span>
                   </div>
                   <p class="text-xs font-medium text-on-surface-variant italic">Hubungi jastiper untuk detail pembayaran.</p>
                </div>
              </div>

              <!-- Upload Receipt Section -->
              <div v-if="order.status === 'pending' || order.payment_receipt" class="bg-surface-container rounded-[2rem] p-6 border-2 border-primary/5 space-y-4">
                 <div class="flex items-center justify-between">
                    <h3 class="font-black text-on-surface uppercase tracking-tight text-sm">Bukti Pembayaran</h3>
                    <span v-if="order.payment_receipt" class="badge badge-success badge-sm rounded-full font-bold">Terupload</span>
                 </div>

                 <div v-if="order.payment_receipt" class="relative group">
                    <img :src="order.payment_receipt" class="w-full rounded-2xl shadow-lg border-2 border-primary/10 max-h-48 object-cover" />
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                       <button @click="order.payment_receipt = null" class="btn btn-circle btn-error btn-sm">
                          <span class="material-symbols-outlined text-sm">delete</span>
                       </button>
                    </div>
                 </div>

                 <div v-else class="space-y-4">
                    <label class="w-full h-32 border-2 border-dashed border-primary/30 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 transition-all group">
                       <span class="material-symbols-outlined text-3xl text-primary transition-transform group-hover:scale-110">add_a_photo</span>
                       <span class="text-xs font-black text-primary uppercase">Klik untuk Upload Bukti</span>
                       <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
                    </label>
                    <div v-if="isUploading" class="flex items-center justify-center gap-2 text-primary">
                       <span class="loading loading-spinner loading-xs"></span>
                       <span class="text-[10px] font-black uppercase">Mengupload...</span>
                    </div>
                 </div>
              </div>

              <div class="flex gap-3">
                <a :href="`https://wa.me/${(order.jastiper_phone || '').replace(/^0/, '62')}?text=${encodeURIComponent('Halo! Saya ingin konfirmasi pembayaran untuk order #ORDER-' + order.id)}`" target="_blank" class="flex-1 bg-primary text-on-primary font-bold py-4 rounded-full hover:scale-105 transition-all shadow-xl shadow-primary/40 flex justify-center items-center gap-2">
                  <span class="material-symbols-outlined text-xl">send</span>
                  <span class="text-sm">Konfirmasi (WA)</span>
                </a>
              </div>
            </template>

            <button @click="cancelOrder" class="btn btn-ghost btn-sm text-error hover:bg-error/10 font-bold gap-2 rounded-full w-full mt-4">
              <span class="material-symbols-outlined text-sm">cancel</span>
              BATALKAN PESANAN
            </button>
          </div>

          <div v-else class="space-y-4">
             <div class="w-20 h-20 bg-secondary-container text-secondary rounded-full mx-auto flex items-center justify-center">
                <span class="material-symbols-outlined text-4xl">check_circle</span>
             </div>
             <h3 class="text-xl font-bold">Awesome!</h3>
             <p class="text-sm text-on-surface-variant">Order kamu sedang diproses oleh Jastiper. Tunggu update selanjutnya ya!</p>
             <button @click="navigateTo('/')" class="btn btn-ghost rounded-full px-8">Back to Home</button>
          </div>
        </div>
      </aside>
    </template>

    <div v-else class="flex-1 flex flex-col items-center justify-center py-20 text-center">
       <span class="material-symbols-outlined text-8xl text-outline-variant/30">search_off</span>
       <h2 class="text-2xl font-bold mt-4">Order Not Found</h2>
       <p class="text-on-surface-variant">Pastikan ID order yang kamu masukkan benar.</p>
       <button @click="navigateTo('/')" class="btn btn-primary rounded-full mt-6 px-10">Back to Home</button>
    </div>
  </div>
</template>

<script setup>
const { getOrder, deleteOrder, getPaymentMethods } = useApi();
const route = useRoute();
const router = useRouter();

const order = ref(null);
const loading = ref(true);
const paymentMethods = ref([]);

const fetchOrder = async () => {
    try {
        const res = await getOrder(route.params.id);
        order.value = res;
        if (res && res.jastiper_id) {
            paymentMethods.value = await getPaymentMethods(res.jastiper_id);
        }
    } catch (e) {
        console.error('Failed to fetch order', e);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchOrder);

const cancelOrder = async () => {
    if (!confirm('Yakin ingin membatalkan pesanan ini?')) return;
    try {
        await deleteOrder(order.value.id);
        
        // Remove from local storage history
        const saved = JSON.parse(localStorage.getItem('jastipcoy_orders') || '[]');
        const updated = saved.filter(id => id != order.value.id);
        localStorage.setItem('jastipcoy_orders', JSON.stringify(updated));
        
        alert('Pesanan berhasil dibatalkan');
        router.push('/orders');
    } catch (e) {
        alert('Gagal membatalkan pesanan.');
    }
};

const orderItems = computed(() => {
    if (!order.value?.details) return [];
    return order.value.details.map(d => ({
        id: d.menu_item_id,
        name: d.item_name,
        price: d.price,
        quantity: d.quantity,
        note: d.note
    }));
});

const isPriceConfirmed = computed(() => {
    if (!orderItems.value || orderItems.value.length === 0) return false;
    return orderItems.value.every(item => {
        const val = parseInt(item.price);
        return !isNaN(val) && val > 0;
    });
});

const getIcon = (type) => {
    if (type === 'qr') return 'qr_code_2';
    if (type === 'bank') return 'account_balance';
    return 'account_balance_wallet';
};

const statusConfig = {
    pending: {
        title: 'Payment Required',
        message: 'Silakan lakukan pembayaran dan konfirmasi ke Jastiper.',
        icon: 'account_balance_wallet',
        bg: 'bg-primary-container border-primary/10 shadow-primary-container/20',
        color: 'text-primary',
        textColor: 'text-on-primary-container'
    },
    procuring: {
        title: 'Shopper on the Way',
        message: 'Jastiper sedang membelikan pesananmu! 🔥',
        icon: 'delivery_dining',
        bg: 'bg-secondary-container border-secondary/10 shadow-secondary-container/20',
        color: 'text-secondary',
        textColor: 'text-on-secondary-container'
    },
    ready: {
        title: 'Ready for Pick-up',
        message: 'Pesananmu sudah siap! Segera ambil di lokasi ya.',
        icon: 'package_2',
        bg: 'bg-emerald-100 border-emerald-500/10 shadow-emerald-500/10',
        color: 'text-emerald-600',
        textColor: 'text-emerald-900'
    },
    completed: {
        title: 'Order Completed',
        message: 'Terima kasih sudah jastip! Sampai jumpa di jastip berikutnya.',
        icon: 'task_alt',
        bg: 'bg-slate-100 border-slate-500/10 shadow-slate-500/10',
        color: 'text-slate-600',
        textColor: 'text-slate-900'
    }
};

const timelineSteps = [
    { status: 'pending', title: 'Order Placed', message: 'Menunggu konfirmasi pembayaran', icon: 'receipt' },
    { status: 'procuring', title: 'Procuring', message: 'Jastiper sedang menuju lokasi merchant', icon: 'shopping_cart' },
    { status: 'ready', title: 'Ready', message: 'Item sudah tersedia dan siap diantar/ambil', icon: 'storefront' },
    { status: 'completed', title: 'Completed', message: 'Pesanan sudah diterima dengan selamat', icon: 'done_all' }
];

const isStepActive = (status) => {
    const statuses = ['pending', 'procuring', 'ready', 'completed'];
    const currentIdx = statuses.indexOf(order.value?.status || 'pending');
    const stepIdx = statuses.indexOf(status);
    return stepIdx <= currentIdx;
};

const isUploading = ref(false);
const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        isUploading.value = true;
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result;
            await useApi().uploadReceipt({
                order_id: order.value.id,
                receipt: base64
            });
            order.value.payment_receipt = base64;
        };
        reader.readAsDataURL(file);
    } catch (e) {
        alert('Gagal upload bukti');
    } finally {
        isUploading.value = false;
    }
};
</script>

<style scoped>
@keyframes scan {
  0% { transform: translateY(0); }
  50% { transform: translateY(200px); }
  100% { transform: translateY(0); }
}

.animate-scan {
  animation: scan 3s ease-in-out infinite;
}
</style>

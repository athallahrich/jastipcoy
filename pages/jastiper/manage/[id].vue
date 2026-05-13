<template>
  <div class="max-w-5xl mx-auto pb-24">
    <!-- Session Context Header -->
    <div v-if="session" class="bg-white rounded-[3rem] p-8 shadow-xl shadow-primary-container/10 border border-outline-variant/20 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 bg-primary-container text-primary rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined text-4xl fill">restaurant</span>
        </div>
        <div>
          <div class="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1">Active Session</div>
          <h1 class="text-3xl font-black text-on-surface font-plus-jakarta tracking-tight">{{ session.title }}</h1>
          <p class="text-on-surface-variant font-medium flex items-center gap-2 mt-1">
            <span class="material-symbols-outlined text-sm">location_on</span>
            {{ session.location_name }}
          </p>
        </div>
      </div>
      <div class="flex gap-3">
        <div class="bg-surface-container px-6 py-4 rounded-[2rem] text-center border border-outline-variant/30">
          <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Pesanan</div>
          <div class="text-2xl font-black text-primary">{{ orders.length }}</div>
        </div>
        <div class="bg-surface-container px-6 py-4 rounded-[2rem] text-center border border-outline-variant/30">
          <div class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total Omzet</div>
          <div class="text-2xl font-black text-secondary">Rp {{ totalSales.toLocaleString('id-ID') }}</div>
        </div>
      </div>
    </div>

    <!-- Management Controls -->
    <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div class="flex gap-3">
        <button @click="copyShareLink" class="btn btn-primary rounded-full px-8 gap-2 shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined">share</span>
          Copy Link Jastip
        </button>
        <button @click="blastWhatsApp" class="btn btn-secondary rounded-full px-8 gap-2 shadow-lg shadow-secondary/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.779 2.853 2.934-.769c.946.514 1.777.822 2.594.822 3.18 0 5.767-2.586 5.767-5.766 0-3.18-2.587-5.766-5.767-5.766zm3.39 8.121c-.131.371-.781.71-1.077.749-.297.039-.571.053-1.636-.371-.84-.336-1.574-.836-2.222-1.484-.648-.648-1.148-1.382-1.484-2.222-.424-1.065-.41-1.339-.371-1.636.039-.296.377-.946.749-1.077.104-.037.218-.052.33-.053l.3.003c.124.004.246.012.366.059.204.079.356.241.446.435.158.343.376.819.387.842.062.13.064.276.009.41-.059.141-.161.271-.256.375l-.261.284c-.1.109-.204.195-.088.396.116.201.516.852 1.109 1.445.593.593 1.244.993 1.445 1.109.131.076.245.05.342-.057l.186-.206c.108-.12.235-.246.39-.3.155-.054.309-.039.463.018.154.057.973.458 1.139.541.166.082.277.123.317.191.04.068.04.394-.091.765z"/>
            <path d="M12.036 0c-6.627 0-12 5.373-12 12 0 2.159.57 4.186 1.564 5.94l-1.6 5.86 6.001-1.573c1.706.945 3.669 1.473 5.753 1.473 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.8c-2.023 0-3.923-.551-5.556-1.507l-.398-.234-3.57.936.953-3.483-.263-.418c-.997-1.585-1.566-3.468-1.566-5.494 0-5.403 4.397-9.8 9.8-9.8s9.8 4.397 9.8 9.8-4.397 9.8-9.8 9.8z"/>
          </svg>
          WhatsApp Blast
        </button>
      </div>

      <!-- Bulk Actions -->
      <div v-if="orders.length > 0" class="flex items-center gap-3 bg-surface-container/50 p-2 rounded-full border border-outline-variant/30">
        <span class="text-[10px] font-black uppercase text-on-surface-variant/60 ml-4 hidden sm:inline">Bulk Action:</span>
        <button @click="bulkStatus('procuring')" class="btn btn-xs sm:btn-sm btn-ghost hover:bg-secondary/10 text-secondary font-black rounded-full px-4">
          <span class="material-symbols-outlined text-xs">shopping_bag</span>
          Beli Semua
        </button>
        <button @click="bulkStatus('ready')" class="btn btn-xs sm:btn-sm btn-ghost hover:bg-emerald-100 text-emerald-600 font-black rounded-full px-4">
          <span class="material-symbols-outlined text-xs">check_circle</span>
          Siap Semua
        </button>
      </div>
    </div>

    <!-- Orders Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="bg-white rounded-[2.5rem] p-8 shadow-xl border-2 transition-all relative overflow-hidden"
        :class="order.status === 'completed' ? 'border-emerald-500/20 bg-emerald-50/10' : 'border-outline-variant/20 bg-white'"
      >
        <!-- Buyer Header -->
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container flex items-center justify-center">
               <span class="material-symbols-outlined text-outline">person</span>
            </div>
            <div>
              <h3 class="font-black text-on-surface text-lg leading-none">{{ order.buyer_name }}</h3>
              <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{{ order.buyer_phone }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <a :href="`https://wa.me/${order.buyer_phone}`" target="_blank" class="w-10 h-10 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 hover:scale-110 transition-transform p-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.779 2.853 2.934-.769c.946.514 1.777.822 2.594.822 3.18 0 5.767-2.586 5.767-5.766 0-3.18-2.587-5.766-5.767-5.766zm3.39 8.121c-.131.371-.781.71-1.077.749-.297.039-.571.053-1.636-.371-.84-.336-1.574-.836-2.222-1.484-.648-.648-1.148-1.382-1.484-2.222-.424-1.065-.41-1.339-.371-1.636.039-.296.377-.946.749-1.077.104-.037.218-.052.33-.053l.3.003c.124.004.246.012.366.059.204.079.356.241.446.435.158.343.376.819.387.842.062.13.064.276.009.41-.059.141-.161.271-.256.375l-.261.284c-.1.109-.204.195-.088.396.116.201.516.852 1.109 1.445.593.593 1.244.993 1.445 1.109.131.076.245.05.342-.057l.186-.206c.108-.12.235-.246.39-.3.155-.054.309-.039.463.018.154.057.973.458 1.139.541.166.082.277.123.317.191.04.068.04.394-.091.765z"/>
                <path d="M12.036 0c-6.627 0-12 5.373-12 12 0 2.159.57 4.186 1.564 5.94l-1.6 5.86 6.001-1.573c1.706.945 3.669 1.473 5.753 1.473 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.8c-2.023 0-3.923-.551-5.556-1.507l-.398-.234-3.57.936.953-3.483-.263-.418c-.997-1.585-1.566-3.468-1.566-5.494 0-5.403 4.397-9.8 9.8-9.8s9.8 4.397 9.8 9.8-4.397 9.8-9.8 9.8z"/>
              </svg>
            </a>
            <button @click="removeOrder(order.id)" class="w-10 h-10 rounded-full flex items-center justify-center bg-error/10 text-error hover:bg-error hover:text-white transition-all">
              <span class="material-symbols-outlined text-xl">delete</span>
            </button>
          </div>
        </div>

        <!-- Items List -->
        <div class="space-y-3 mb-6">
          <div v-for="(item, idx) in parseItems(order.items)" :key="idx" class="flex justify-between items-center bg-surface-container/50 p-4 rounded-2xl group">
             <div class="flex items-center gap-3">
               <span class="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">{{ item.quantity }}x</span>
               <div class="flex flex-col">
                 <span class="text-sm font-bold text-on-surface leading-tight">{{ item.name }}</span>
               </div>
             </div>
             <div class="flex flex-col items-end">
                <span class="font-black text-on-surface text-sm">Rp {{ (parseInt(item.price) * item.quantity).toLocaleString('id-ID') }}</span>
             </div>
          </div>
        </div>

        <!-- Payment Info Chip -->
        <div v-if="order.payment_method_id" class="mb-4 px-4 py-3 bg-primary-container/30 rounded-2xl border border-primary/10 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-primary text-sm">payments</span>
            <div class="text-xs">
              <span class="font-black text-primary uppercase">{{ order.pm_provider || order.pm_type }}</span>
              <span class="text-on-surface-variant ml-2 font-bold">{{ order.pm_account_number }}</span>
            </div>
          </div>
          
          <!-- Receipt Preview Trigger -->
          <div v-if="order.payment_receipt" class="flex gap-2">
             <button @click="openReceipt(order.payment_receipt)" class="btn btn-primary btn-xs rounded-full normal-case text-[10px] font-black">
                Lihat Bukti Bayar
             </button>
          </div>
        </div>

        <!-- Actions -->
        <div>
          <label class="text-[10px] font-black uppercase text-on-surface-variant/50 tracking-widest block mb-2 px-2">Update Status Pesanan</label>
          <div class="flex gap-3">
            <select 
              class="select select-bordered rounded-full flex-1 font-bold text-sm bg-surface-container/30 border-none ring-2 ring-primary/10"
              :value="order.status || 'pending'"
              @change="(e) => updateStatus(order.id, e.target.value)"
            >
              <option value="pending">Pending (Belum Bayar)</option>
              <option value="procuring">Procuring (Sedang Dibeli)</option>
              <option value="ready">Ready (Siap Diambil)</option>
              <option value="completed">Completed (Selesai)</option>
            </select>
          </div>
        </div>

        <!-- Status Badge overlay -->
        <div class="absolute top-0 right-0 p-4 pointer-events-none">
           <div :class="['text-[10px] font-black px-4 py-1 rounded-bl-3xl rounded-tr-3xl shadow-sm uppercase tracking-widest', 
                        statusColors[order.status || 'pending'] || 'bg-primary text-white']">
              {{ order.status || 'pending' }}
           </div>
        </div>
      </div>
    </div>
    
    <div v-if="orders.length === 0" class="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-outline-variant/30">
        <span class="material-symbols-outlined text-6xl text-outline-variant/30 mb-4">inbox_customize</span>
        <p class="text-on-surface-variant italic font-medium">Belum ada orderan masuk untuk sesi ini.</p>
    </div>

    <!-- Receipt Preview Modal -->
    <div v-if="activeReceipt" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click="activeReceipt = null">
       <div class="relative max-w-sm w-full bg-white rounded-[2rem] p-4 shadow-2xl animate-in zoom-in duration-300" @click.stop>
          <button @click="activeReceipt = null" class="absolute -top-12 right-0 text-white flex items-center gap-2 font-black uppercase text-xs tracking-widest">
             Tutup <span class="material-symbols-outlined">close</span>
          </button>
          <img :src="activeReceipt" class="w-full rounded-2xl shadow-inner border-2 border-primary/5 max-h-[70vh] object-contain" />
          <div class="mt-4 text-center">
             <p class="text-[10px] font-black uppercase text-on-surface-variant/40 tracking-widest leading-none">Bukti Pembayaran Pembeli</p>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
const { getSession, getOrders, updateOrderStatus, updateBatchStatus, deleteOrder } = useApi();
const route = useRoute();

const session = ref(null);
const orders = ref([]);

const statusColors = {
    pending: 'bg-primary text-white',
    procuring: 'bg-secondary text-white',
    ready: 'bg-emerald-500 text-white',
    completed: 'bg-slate-400 text-white'
};

const fetchData = async () => {
  try {
    session.value = await getSession(route.params.id);
    orders.value = await getOrders(route.params.id);
  } catch (error) {
    console.error('Failed to fetch management details', error);
  }
};

onMounted(fetchData);

const totalSales = computed(() => {
  return orders.value.reduce((acc, o) => acc + parseInt(o.amount), 0);
});

const parseItems = (itemsStr) => {
  try {
    const parsed = JSON.parse(itemsStr || '[]');
    return parsed.map(p => {
       if (p.name) return p; // Format baru (sudah ada nama & harga)
       
       // Saling silang dengan menu session untuk data lama {id, quantity}
       const sessionMenu = JSON.parse(session.value?.menu_json || '[]');
       const item = sessionMenu.find(m => m.id === p.id);
       return { 
         ...p, 
         name: item?.name || 'Item Terhapus', 
         price: item?.price || 0 
       };
    });
  } catch (e) {
    return [];
  }
};

const updateStatus = async (orderId, newStatus) => {
  try {
    await updateOrderStatus(orderId, newStatus);
    const order = orders.value.find(o => o.id === orderId);
    if (order) order.status = newStatus;
  } catch (error) {
    alert('Gagal update status');
  }
};

const bulkStatus = async (status) => {
    if (!orders.value.length) return;
    if (!confirm(`Update semua pesanan (${orders.value.length}) menjadi '${status}'?`)) return;
    try {
        await updateBatchStatus(route.params.id, status);
        orders.value.forEach(o => o.status = status);
    } catch (e) {
        alert('Gagal update massal.');
    }
};

const removeOrder = async (orderId) => {
    if (!confirm('Hapus orderan ini? Tindakan ini tidak bisa dibatalkan.')) return;
    try {
        await deleteOrder(orderId);
        orders.value = orders.value.filter(o => o.id !== orderId);
    } catch (e) {
        alert('Gagal menghapus orderan.');
    }
};

const copyShareLink = () => {
    const link = `${window.location.origin}/sessions?token=${session.value.share_token}`;
    navigator.clipboard.writeText(link);
    alert('Link share berhasil disalin!');
};

const blastWhatsApp = () => {
    if (orders.value.length === 0) return;
    const phones = orders.value.map(o => o.buyer_phone).join(',');
    const text = encodeURIComponent(`Halo teman-teman, sesi jastip '${session.value.title}' memasuki tahap baru! Pantau terus ya ✨`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
};

const activeReceipt = ref(null);
const openReceipt = (src) => {
    activeReceipt.value = src;
};
</script>

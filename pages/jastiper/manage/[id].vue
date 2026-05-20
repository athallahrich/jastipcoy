<template>
  <div class="max-w-5xl mx-auto pb-24">
    <!-- Session Context Header -->
    <div v-if="session" class="bg-white rounded-[3rem] p-8 shadow-xl shadow-primary-container/10 border border-outline-variant/20 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 bg-primary-container text-primary rounded-[2rem] flex items-center justify-center shadow-lg shadow-primary/10">
          <span class="material-symbols-outlined text-4xl fill">restaurant</span>
        </div>
        <div>
          <div class="flex items-center gap-2 mb-1">
            <div class="text-[10px] font-black uppercase tracking-widest text-primary/60">Session Info</div>
            <div :class="['badge badge-sm font-bold text-[10px]', session.status === 'closed' ? 'badge-error' : 'badge-success']">
              {{ session.status === 'closed' ? 'CLOSED' : 'ACTIVE' }}
            </div>
          </div>
          <h1 class="text-3xl font-black text-on-surface font-plus-jakarta tracking-tight">{{ session.title }}</h1>
          <p class="text-on-surface-variant font-medium flex items-center gap-2 mt-1">
            <span class="material-symbols-outlined text-sm">location_on</span>
            {{ session.location_name }}
          </p>
          <p class="text-xs text-on-surface-variant mt-1 flex items-center gap-2">
            <span class="material-symbols-outlined text-sm">timer</span>
            Closes at: {{ session.closing_time ? new Date(session.closing_time.replace(' ', 'T')).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) : '-' }}
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
      <div class="flex flex-wrap gap-3">
        <button v-if="session?.status !== 'closed'" @click="copyShareLink" class="btn btn-primary rounded-full px-6 md:px-8 gap-2 shadow-lg shadow-primary/20">
          <span class="material-symbols-outlined">share</span>
          Copy Link Jastip
        </button>
        <button v-if="session?.status !== 'closed'" @click="blastWhatsApp" class="btn btn-secondary rounded-full px-6 md:px-8 gap-2 shadow-lg shadow-secondary/20">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.779 2.853 2.934-.769c.946.514 1.777.822 2.594.822 3.18 0 5.767-2.586 5.767-5.766 0-3.18-2.587-5.766-5.767-5.766zm3.39 8.121c-.131.371-.781.71-1.077.749-.297.039-.571.053-1.636-.371-.84-.336-1.574-.836-2.222-1.484-.648-.648-1.148-1.382-1.484-2.222-.424-1.065-.41-1.339-.371-1.636.039-.296.377-.946.749-1.077.104-.037.218-.052.33-.053l.3.003c.124.004.246.012.366.059.204.079.356.241.446.435.158.343.376.819.387.842.062.13.064.276.009.41-.059.141-.161.271-.256.375l-.261.284c-.1.109-.204.195-.088.396.116.201.516.852 1.109 1.445.593.593 1.244.993 1.445 1.109.131.076.245.05.342-.057l.186-.206c.108-.12.235-.246.39-.3.155-.054.309-.039.463.018.154.057.973.458 1.139.541.166.082.277.123.317.191.04.068.04.394-.091.765z"/>
            <path d="M12.036 0c-6.627 0-12 5.373-12 12 0 2.159.57 4.186 1.564 5.94l-1.6 5.86 6.001-1.573c1.706.945 3.669 1.473 5.753 1.473 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.8c-2.023 0-3.923-.551-5.556-1.507l-.398-.234-3.57.936.953-3.483-.263-.418c-.997-1.585-1.566-3.468-1.566-5.494 0-5.403 4.397-9.8 9.8-9.8s9.8 4.397 9.8 9.8-4.397 9.8-9.8 9.8z"/>
          </svg>
          WhatsApp Blast
        </button>
        <button @click="sendRecapWhatsApp" class="btn bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-full px-6 md:px-8 gap-2 shadow-sm">
          <span class="material-symbols-outlined">summarize</span>
          Rekap Order WA
        </button>
        <button v-if="session?.status !== 'closed'" @click="closeSession" class="btn btn-error text-white rounded-full px-6 md:px-8 gap-2 shadow-lg shadow-error/20">
          <span class="material-symbols-outlined">block</span>
          Tutup Sesi
        </button>
      </div>

      <!-- Bulk Actions -->
      <div v-if="orders.length > 0 && session?.status !== 'closed'" class="flex items-center gap-3 bg-surface-container/50 p-2 rounded-2xl border border-outline-variant/30">
        <span class="text-[10px] font-black uppercase text-on-surface-variant/60 ml-4 hidden sm:inline">Update Semua:</span>
        <select 
          class="select select-bordered select-sm rounded-full bg-white border-none ring-2 ring-primary/10 focus:ring-primary font-bold text-sm"
          v-model="bulkSelected"
        >
          <option value="" disabled>Pilih Status</option>
          <option value="pending">Pending (Belum Bayar)</option>
          <option value="procuring">Procuring (Sedang Dibeli)</option>
          <option value="ready">Ready (Siap Diambil)</option>
          <option value="completed">Completed (Selesai)</option>
        </select>
        <button @click="applyBulk" class="btn btn-sm btn-primary rounded-full px-4" :disabled="!bulkSelected">
          Terapkan
        </button>
      </div>
    </div>

    <!-- Orders Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="order in orders" 
        :key="order.id"
        class="bg-white rounded-[2rem] p-6 shadow-xl shadow-primary-container/5 border border-outline-variant/30 transition-all relative overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-primary-container/10 group/card"
        :class="order.status === 'completed' ? 'bg-emerald-50/20 border-emerald-500/30' : ''"
      >
        <div class="flex flex-col gap-6">
          <!-- Buyer Header -->
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container bg-surface-container flex items-center justify-center text-primary shadow-sm">
                 <span class="material-symbols-outlined text-2xl fill">person</span>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-black text-on-surface text-base leading-none">{{ order.buyer_name }}</h3>
                  <span class="text-xs font-black text-primary bg-primary-container/50 px-2 py-0.5 rounded-full">#{{ order.id }}</span>
                </div>
                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">{{ order.buyer_phone }}</p>
              </div>
            </div>
            <div class="flex gap-2">
              <a :href="getWaLink(order)" target="_blank" class="w-9 h-9 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 hover:scale-110 transition-transform p-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-full h-full">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.779 2.853 2.934-.769c.946.514 1.777.822 2.594.822 3.18 0 5.767-2.586 5.767-5.766 0-3.18-2.587-5.766-5.767-5.766zm3.39 8.121c-.131.371-.781.71-1.077.749-.297.039-.571.053-1.636-.371-.84-.336-1.574-.836-2.222-1.484-.648-.648-1.148-1.382-1.484-2.222-.424-1.065-.41-1.339-.371-1.636.039-.296.377-.946.749-1.077.104-.037.218-.052.33-.053l.3.003c.124.004.246.012.366.059.204.079.356.241.446.435.158.343.376.819.387.842.062.13.064.276.009.41-.059.141-.161.271-.256.375l-.261.284c-.1.109-.204.195-.088.396.116.201.516.852 1.109 1.445.593.593 1.244.993 1.445 1.109.131.076.245.05.342-.057l.186-.206c.108-.12.235-.246.39-.3.155-.054.309-.039.463.018.154.057.973.458 1.139.541.166.082.277.123.317.191.04.068.04.394-.091.765z"/>
                  <path d="M12.036 0c-6.627 0-12 5.373-12 12 0 2.159.57 4.186 1.564 5.94l-1.6 5.86 6.001-1.573c1.706.945 3.669 1.473 5.753 1.473 6.627 0 12-5.373 12-12s-5.373-12-12-12zm0 21.8c-2.023 0-3.923-.551-5.556-1.507l-.398-.234-3.57.936.953-3.483-.263-.418c-.997-1.585-1.566-3.468-1.566-5.494 0-5.403 4.397-9.8 9.8-9.8s9.8 4.397 9.8 9.8-4.397 9.8-9.8 9.8z"/>
                </svg>
              </a>
              <button v-if="session?.status !== 'closed'" @click="removeOrder(order.id)" class="w-9 h-9 rounded-full flex items-center justify-center bg-error/10 text-error hover:bg-error hover:text-white transition-all shadow-sm">
                <span class="material-symbols-outlined text-lg">delete</span>
              </button>
            </div>
          </div>

          <!-- Items List -->
          <div class="space-y-3">
            <div v-for="(item, idx) in order.details" :key="idx" class="flex justify-between items-center bg-surface-container/40 p-4 rounded-2xl group border border-outline-variant/10 hover:border-outline-variant/30 transition-colors">
               <div class="flex items-center gap-3 flex-grow">
                 <span class="bg-primary text-white text-xs font-black px-2 py-1 rounded-lg shadow-sm shadow-primary/20">{{ item.quantity }}x</span>
                 <div class="flex flex-col gap-0.5 min-w-0 flex-grow">
                   <span class="text-sm font-bold text-on-surface leading-tight">{{ item.item_name }}</span>
                   <span v-if="item.note" class="text-[10px] italic text-on-surface-variant mt-0.5">Note: {{ item.note }}</span>
                 </div>
               </div>
               <div class="flex flex-col items-end gap-1 flex-shrink-0">
                  <div class="flex items-center gap-1">
                    <span class="text-xs font-bold text-on-surface-variant">@</span>
                    <input 
                      v-if="session?.status !== 'closed'"
                      type="number"
                      class="bg-transparent border-b border-dashed border-outline-variant focus:border-primary focus:outline-none w-20 text-right font-bold text-sm text-on-surface"
                      :value="item.price"
                      @change="(e) => updateItemPrice(order, idx, e.target.value)"
                      placeholder="Harga"
                    />
                    <span v-else class="w-20 text-right font-bold text-sm text-on-surface">Rp {{ parseInt(item.price || 0).toLocaleString('id-ID') }}</span>
                  </div>
                  <span class="font-black text-primary text-sm">Rp {{ (parseInt(item.price || 0) * item.quantity).toLocaleString('id-ID') }}</span>
               </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4 mt-6">
          <!-- Jastip Fee and Total -->
          <div class="flex flex-col gap-2 p-4 bg-surface-container/20 rounded-2xl border border-outline-variant/10">
             <div class="text-xs font-bold text-on-surface-variant flex justify-between w-full">
               <span>Fee Jastip</span>
               <span class="font-black">Rp {{ parseInt(session?.fee || 5000).toLocaleString('id-ID') }}</span>
             </div>
             <div class="text-base font-black text-on-surface flex justify-between w-full border-t border-outline-variant/20 pt-2 mt-1">
               <span>Total Tagihan</span>
               <span class="text-primary">Rp {{ parseInt(order.amount).toLocaleString('id-ID') }}</span>
             </div>
          </div>

          <!-- Payment Info Chip -->
          <div v-if="order.payment_method_id" class="px-4 py-3 bg-primary-container/30 rounded-2xl border border-primary/10 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-sm">payments</span>
              <div class="text-xs">
                <span class="font-black text-primary uppercase">{{ order.pm_provider || order.pm_type }}</span>
                <span class="text-on-surface-variant ml-2 font-bold">{{ order.pm_account_number }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Receipt Preview -->
          <div v-if="order.payment_receipt" class="px-4 py-3 bg-surface-container rounded-2xl border border-outline-variant/20 flex flex-col gap-2">
             <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-on-surface-variant">Bukti Pembayaran</span>
                <span class="badge badge-success badge-sm font-bold rounded-full">Terupload</span>
             </div>
             <div class="relative group cursor-pointer" @click="openReceipt(order.payment_receipt)">
                <img :src="order.payment_receipt" class="w-full rounded-lg max-h-32 object-cover border border-outline-variant/20" />
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                   <span class="material-symbols-outlined text-white text-xl">visibility</span>
                </div>
             </div>
          </div>

          <!-- Actions -->
          <div v-if="session?.status !== 'closed'">
            <label class="text-[10px] font-black uppercase text-on-surface-variant/50 tracking-widest block mb-2 px-2">Update Status Pesanan</label>
            <div class="flex gap-3">
              <select 
                class="select select-bordered select-sm rounded-full flex-1 font-bold text-sm bg-surface-container/30 border-none ring-2 ring-primary/10 focus:ring-primary"
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
        </div>

        <!-- Status Badge overlay -->
        <div class="absolute top-0 right-0 pointer-events-none">
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
const { getSession, getOrders, updateOrderStatus, updateBatchStatus, deleteOrder, updateSessionMenuPrice } = useApi();
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



const updateItemPrice = async (order, itemIdx, newPrice) => {
    try {
        const items = order.details;
        const targetItem = items[itemIdx];
        const priceNum = parseInt(newPrice) || 0;
        
        if (confirm(`Ingin mengupdate harga menu "${targetItem.item_name}" menjadi Rp ${priceNum.toLocaleString('id-ID')} untuk KESELURUHAN orderan lain di sesi ini?`)) {
            await updateSessionMenuPrice(session.value?.id || route.params.id, targetItem.menu_item_id || null, targetItem.item_name, priceNum);
            await fetchData();
            alert('Harga berhasil diupdate untuk seluruh orderan!');
            return;
        }

        items[itemIdx].price = priceNum;
        const jastipFee = parseInt(session.value?.fee || 5000);
        const subtotal = items.reduce((acc, item) => acc + (parseInt(item.price || 0) * item.quantity), 0);
        const newAmount = subtotal + jastipFee;
        
        await useApi().fetchApi('/orders', {
            method: 'PATCH',
            body: JSON.stringify({
                id: order.id,
                items: items,
                amount: newAmount
            })
        });
        order.amount = newAmount;
    } catch (e) {
        alert('Gagal update harga: ' + (e.message || e));
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

const bulkSelected = ref('');

const applyBulk = async () => {
    if (!bulkSelected.value) return;
    if (!orders.value.length) return;
    if (!confirm(`Update semua pesanan (${orders.value.length}) menjadi '${bulkSelected.value}'?`)) return;
    try {
        await updateBatchStatus(route.params.id, bulkSelected.value);
        orders.value.forEach(o => o.status = bulkSelected.value);
        bulkSelected.value = '';
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

const getWaLink = (order) => {
  const phone = (order.buyer_phone || '').replace(/^0/, '62');
  const itemsText = order.details.map(item => `- ${item.quantity}x ${item.item_name}`).join('\n');
  const totalText = `Total: Rp ${parseInt(order.amount).toLocaleString('id-ID')}`;
  const linkText = `Link Pesanan: ${window.location.origin}/orders/${order.id}`;
  
  const text = `Halo ${order.buyer_name}!\n\nIni detail pesanan kamu:\n${itemsText}\n\n${totalText}\n\n${linkText}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};

const copyShareLink = () => {
    const link = `${window.location.origin}/sessions?token=${session.value.share_token}`;
    navigator.clipboard.writeText(link);
    alert('Link share berhasil disalin!');
};

const blastWhatsApp = () => {
    const link = `${window.location.origin}/sessions?token=${session.value.share_token}`;
    const text = encodeURIComponent(`Halo teman-teman! Saya sedang membuka jastip '${session.value.title}' nih. Yuk yang mau titip bisa langsung klik link ini ya:\n\n${link}\n\nBuruan order sebelum kuota penuh! ✨`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
};

const sendRecapWhatsApp = () => {
    if (!orders.value.length) {
        alert('Belum ada pesanan untuk direkap.');
        return;
    }
    
    let text = `*REKAP PESANAN*\nSesi: ${session.value.title}\n\n`;
    
    orders.value.forEach((order, index) => {
        text += `*${index + 1}. ${order.buyer_name}*\n`;
        order.details.forEach(item => {
            text += `- ${item.quantity}x ${item.item_name} @Rp${parseInt(item.price||0).toLocaleString('id-ID')}\n`;
            if (item.note) text += `  (Note: ${item.note})\n`;
        });
        text += `Fee Jastip: Rp ${parseInt(session.value?.fee || 5000).toLocaleString('id-ID')}\n`;
        text += `Total Tagihan: Rp ${parseInt(order.amount).toLocaleString('id-ID')}\n`;
        text += `Status: ${order.status.toUpperCase()}\n\n`;
    });
    
    text += `*Total Pesanan: ${orders.value.length} Orang*\n`;
    text += `*Total Keseluruhan Omzet: Rp ${totalSales.value.toLocaleString('id-ID')}*`;
    
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
};

const activeReceipt = ref(null);
const openReceipt = (src) => {
    activeReceipt.value = src;
};

const closeSession = async () => {
    if (!confirm('Yakin ingin menutup sesi jastip ini? Order baru tidak akan bisa masuk lagi.')) return;
    try {
        await useApi().updateSessionStatus(route.params.id, 'closed');
        if (session.value) session.value.status = 'closed';
        alert('Sesi berhasil ditutup!');
        navigateTo('/jastiper/dashboard');
    } catch (e) {
        alert('Gagal menutup sesi: ' + (e.message || e));
    }
};
</script>

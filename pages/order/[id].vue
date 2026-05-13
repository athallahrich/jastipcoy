<template>
  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Left Column: Menu -->
    <div class="flex-1 space-y-8">
      <!-- Jastiper Profile Card -->
      <section v-if="session" class="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-primary-container/10 border border-outline-variant/20 flex flex-col sm:flex-row items-center sm:items-start gap-8">
        <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-primary-container shrink-0 shadow-lg shadow-primary-container/30 bg-surface-container flex items-center justify-center">
           <span class="material-symbols-outlined text-4xl text-outline">person</span>
        </div>
        <div class="flex-1 text-center sm:text-left space-y-2">
          <div class="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold">
            <span class="material-symbols-outlined text-sm animate-pulse">timer</span>
            Closing at {{ session.closing_time }}
          </div>
          <h1 class="text-4xl font-black text-on-surface font-plus-jakarta leading-tight">{{ session.title }}</h1>
          <p class="text-on-surface-variant flex items-center justify-center sm:justify-start gap-2 font-medium">
            <span class="material-symbols-outlined text-primary text-xl">route</span>
            {{ session.location_name }}
          </p>
        </div>
      </section>

      <!-- Menu Grid -->
      <section v-if="session">
        <h2 class="text-2xl font-bold text-on-surface mb-6 px-4 font-plus-jakarta">Available Menu</h2>
        <div v-if="menu.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            v-for="item in menu" 
            :key="item.id"
            class="bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm border border-outline-variant/20 group hover:shadow-xl hover:shadow-primary-container/10 transition-all"
          >
            <div class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative shadow-inner bg-surface-container flex items-center justify-center">
              <span class="material-symbols-outlined text-outline">restaurant</span>
            </div>
            <div class="flex-1">
              <h3 class="font-bold text-on-surface text-lg">{{ item.name }}</h3>
              <p class="text-primary font-black mt-1">Rp {{ parseInt(item.price).toLocaleString('id-ID') }}</p>
              
              <!-- Quantity Controls -->
              <div v-if="getQuantity(item.id) > 0" class="mt-3 flex items-center gap-3 bg-surface-container rounded-full px-4 py-2 w-fit">
                <button @click="updateQuantity(item.id, -1)" class="text-on-surface-variant hover:text-primary transition-colors">
                  <span class="material-symbols-outlined text-sm">remove</span>
                </button>
                <span class="font-bold text-on-surface w-4 text-center">{{ getQuantity(item.id) }}</span>
                <button @click="updateQuantity(item.id, 1)" class="text-on-surface-variant hover:text-primary transition-colors">
                  <span class="material-symbols-outlined text-sm">add</span>
                </button>
              </div>
              <button 
                v-else 
                @click="updateQuantity(item.id, 1)"
                class="mt-3 btn btn-primary btn-sm btn-circle shadow-lg shadow-primary/20"
              >
                <span class="material-symbols-outlined">add</span>
              </button>
            </div>
          </div>
        </div>
        <div v-else class="p-10 text-center bg-white rounded-3xl border-2 border-dashed border-outline-variant/30">
           <p class="text-on-surface-variant italic">No items listed. Use custom request or contact jastiper.</p>
        </div>
      </section>
    </div>

    <!-- Right Column: Sidebar -->
    <aside class="w-full lg:w-96 shrink-0">
      <div v-if="session" class="sticky top-24 bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-primary-container/20 border border-outline-variant/30 space-y-8">
        <h2 class="text-2xl font-bold text-on-surface font-plus-jakarta">Order Summary</h2>

        <!-- Order Items -->
        <div class="space-y-4">
          <div v-if="cart.length === 0" class="text-center py-12 opacity-30 select-none">
            <span class="material-symbols-outlined text-6xl">shopping_cart</span>
            <p class="mt-2 text-xs font-bold uppercase tracking-widest">Cart is empty</p>
          </div>
          <div v-else class="space-y-3 border-b-2 border-surface-container pb-6">
            <div v-for="c in cartDetails" :key="c.id" class="flex justify-between items-center bg-surface-container/50 p-3 rounded-2xl">
              <div class="flex items-center gap-3">
                <span class="badge badge-primary font-bold">{{ c.quantity }}x</span>
                <span class="text-on-surface text-sm font-medium">{{ c.name }}</span>
              </div>
              <span class="font-bold text-on-surface text-sm">Rp {{ c.total }}</span>
            </div>
          </div>
        </div>

        <!-- Price Totals -->
        <div class="space-y-2">
          <div class="flex justify-between text-on-surface-variant text-sm font-medium">
            <span>Subtotal</span>
            <span>Rp {{ subtotal }}</span>
          </div>
          <div class="flex justify-between text-on-surface-variant text-sm font-medium">
            <span>Jastip Fee (Est.)</span>
            <span>Rp 5.000</span>
          </div>
          <div class="flex justify-between text-primary text-2xl font-black font-plus-jakarta pt-4 border-t-2 border-surface-container">
            <span>Total</span>
            <span>Rp {{ grandTotal }}</span>
          </div>
        </div>

        <!-- Buyer Details -->
        <div class="space-y-4 pt-4 border-t-2 border-surface-container">
          <div class="form-control">
            <label class="label font-bold text-on-surface-variant text-xs">Nama Kamu</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">person</span>
              <input type="text" placeholder="Nama untuk pesanan" class="input input-bordered input-sm w-full pl-10 bg-surface focus:border-primary rounded-xl" v-model="buyer.name" required />
            </div>
          </div>
          <div class="form-control">
            <label class="label font-bold text-on-surface-variant text-xs">No. WhatsApp</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">call</span>
              <input type="tel" placeholder="0812xxxxxx" class="input input-bordered input-sm w-full pl-10 bg-surface focus:border-primary rounded-xl" v-model="buyer.phone" required />
            </div>
          </div>
        </div>

        <!-- Payment Methods Selection -->
        <div v-if="paymentMethods.length > 0" class="space-y-4 pt-4 border-t-2 border-surface-container">
          <label class="text-xs font-black uppercase tracking-widest text-on-surface-variant px-2">Pilih Pembayaran:</label>
          <div class="grid grid-cols-1 gap-2">
            <label 
              v-for="method in paymentMethods" 
              :key="method.id"
              class="flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all hover:bg-primary-container/50"
              :class="selectedPaymentMethod === method.id ? 'border-primary bg-primary-container' : 'border-surface-container-high'"
            >
              <input type="radio" :value="method.id" v-model="selectedPaymentMethod" class="radio radio-primary radio-sm" />
              <div class="flex-1">
                <div class="text-[10px] font-black uppercase text-primary/60 leading-none">{{ method.type }}</div>
                <div class="font-bold text-on-surface text-sm">{{ method.provider }}</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Action Button -->
        <button 
          class="btn btn-primary w-full h-16 rounded-full text-lg shadow-xl shadow-primary/30 group"
          :disabled="cart.length === 0 || !buyer.name || !buyer.phone || !selectedPaymentMethod || isLoading"
          @click="submitOrder"
        >
          <span v-if="isLoading" class="loading loading-spinner"></span>
          <span v-else>Place Order</span>
          <span class="material-symbols-outlined group-hover:translate-x-2 transition-transform">send</span>
        </button>
      </div>
    </aside>

    <!-- Payment Overlay -->
    <Teleport to="body">
      <div v-if="orderComplete" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-white rounded-[3rem] w-full max-w-lg p-10 overflow-y-auto max-h-[90vh] space-y-8 shadow-2xl scale-100 transition-transform">
          <div class="text-center space-y-4">
            <div class="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-200">
               <span class="material-symbols-outlined text-4xl fill">verified</span>
            </div>
            <h2 class="text-3xl font-black text-on-surface font-plus-jakarta italic">Yess! Pesanan Terkirim 🚀</h2>
            <p class="text-on-surface-variant font-medium">Selesaikan pembayaran agar Jastiper segera memproses pesananmu.</p>
          </div>

          <!-- Payment Methods -->
          <div class="space-y-4">
            <h3 class="text-xs font-black uppercase tracking-widest text-on-surface-variant px-2">Bayar ke Jastiper:</h3>
            <div v-for="(method, idx) in paymentMethods" :key="idx" class="bg-surface-container/50 rounded-3xl p-6 border border-outline-variant/20 space-y-4">
               <div class="flex items-center gap-4">
                  <div class="bg-white p-2 rounded-xl shadow-sm border border-outline-variant/10">
                    <span class="material-symbols-outlined text-primary text-xl">{{ getIcon(method.type) }}</span>
                  </div>
                  <div>
                    <div class="text-[10px] font-black uppercase text-primary/60 leading-none mb-1">{{ method.type }}</div>
                    <div class="font-black text-on-surface">{{ method.provider }}</div>
                  </div>
               </div>
               
               <div v-if="method.type !== 'qr'" class="bg-white p-4 rounded-2xl border-2 border-outline-variant/30 space-y-1">
                  <div class="text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-50">Nomor Rekening / HP</div>
                  <div class="text-xl font-black text-on-surface font-mono">{{ method.account_number }}</div>
                  <div class="text-xs font-bold text-on-surface-variant">a/n {{ method.account_name }}</div>
               </div>

               <div v-else class="flex flex-col items-center gap-4">
                  <img :src="method.qr_data" class="w-full max-w-[200px] aspect-square object-contain bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/20" />
                  <p class="text-[10px] font-bold text-on-surface-variant text-center opacity-70">Scan QR di atas untuk bayar</p>
               </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-3 pt-4">
             <a :href="`https://wa.me/${session.jastiper_phone || ''}?text=Halo, saya baru saja memesan jastip '${session.title}'. Ini bukti transfernya.`" target="_blank" class="btn btn-secondary w-full rounded-full gap-2 font-black italic shadow-lg shadow-secondary/20 h-14">
                <span class="material-symbols-outlined text-white">whatsapp</span>
                Kirim Bukti via WhatsApp
             </a>
             <button @click="navigateTo('/sessions')" class="btn btn-ghost w-full rounded-full font-bold">Lanjut Cari Jastip Lain</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
const { getSession, placeOrder, getPaymentMethods } = useApi();
const route = useRoute();

const session = ref(null);
const menu = ref([]);
const cart = ref([]);
const buyer = ref({ name: '', phone: '' });
const isLoading = ref(false);
const orderComplete = ref(false);
const paymentMethods = ref([]);
const selectedPaymentMethod = ref(null);

const fetchData = async () => {
    try {
        const id = route.params.id;
        const res = await getSession(id);
        session.value = res;
        try {
            menu.value = JSON.parse(res.menu_json || '[]');
        } catch (e) {
            menu.value = [];
        }

        // Fetch Jastiper's payment methods from the new table
        if (res.jastiper_id) {
            paymentMethods.value = await getPaymentMethods(res.jastiper_id);
            if (paymentMethods.value.length > 0) {
                selectedPaymentMethod.value = paymentMethods.value[0].id;
            }
        }
    } catch (error) {
        console.error('Failed to fetch session', error);
    }
};

const getIcon = (type) => {
    if (type === 'qr') return 'qr_code_2';
    if (type === 'bank') return 'account_balance';
    return 'account_balance_wallet';
};

onMounted(fetchData);

const getQuantity = (id) => cart.value.find(c => c.id === id)?.quantity || 0;

const updateQuantity = (id, delta) => {
  const existing = cart.value.find(c => c.id === id);
  if (existing) {
    existing.quantity += delta;
    if (existing.quantity <= 0) {
      cart.value = cart.value.filter(c => c.id !== id);
    }
  } else if (delta > 0) {
    cart.value.push({ id, quantity: 1 });
  }
};

const cartDetails = computed(() => {
  return cart.value.map(c => {
    const item = menu.value.find(m => m.id === c.id);
    const priceNum = parseInt(item.price);
    return {
      ...item,
      quantity: c.quantity,
      total: (priceNum * c.quantity).toLocaleString('id-ID')
    };
  });
});

const subtotalNum = computed(() => {
    return cart.value.reduce((acc, c) => {
        const item = menu.value.find(m => m.id === c.id);
        return acc + (parseInt(item.price) * c.quantity);
    }, 0);
});

const subtotal = computed(() => subtotalNum.value.toLocaleString('id-ID'));
const grandTotal = computed(() => (subtotalNum.value + 5000).toLocaleString('id-ID'));

const submitOrder = async () => {
  try {
    isLoading.value = true;
    const orderItems = cart.value.map(c => {
        const item = menu.value.find(m => m.id === c.id);
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: c.quantity
        };
    });

    const res = await placeOrder({
        session_id: session.value.id,
        payment_method_id: selectedPaymentMethod.value,
        buyer_name: buyer.value.name,
        buyer_phone: buyer.value.phone,
        items: JSON.stringify(orderItems),
        amount: subtotalNum.value + 5000
    });

    // Save to localStorage
    const savedOrders = JSON.parse(localStorage.getItem('jastipcoy_orders') || '[]');
    savedOrders.push({
        id: res.id,
        session_name: session.value.title,
        amount: subtotalNum.value + 5000,
        status: 'pending'
    });
    localStorage.setItem('jastipcoy_orders', JSON.stringify(savedOrders));

    orderComplete.value = true;
    navigateTo(`/orders/${res.id}`);
  } catch (error) {
    alert('Gagal memesan.');
  } finally {
    isLoading.value = false;
  }
};
</script>

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
            Closing at {{ formattedClosingTime }}
          </div>
          <h1 class="text-4xl font-black text-on-surface font-plus-jakarta leading-tight">{{ session.title }}</h1>
          <div class="space-y-1">
            <p class="text-on-surface-variant flex items-center justify-center sm:justify-start gap-2 font-medium">
              <span class="material-symbols-outlined text-primary text-xl">route</span>
              {{ session.location_name }}
            </p>
            <p class="text-on-surface-variant flex items-center justify-center sm:justify-start gap-2 font-medium">
              <span class="material-symbols-outlined text-primary text-xl">person</span>
              {{ session.jastiper_name || 'Jastiper' }}
            </p>
            <p v-if="session.jastiper_phone" class="text-on-surface-variant flex items-center justify-center sm:justify-start gap-2 font-medium">
              <span class="material-symbols-outlined text-primary text-xl">call</span>
              {{ session.jastiper_phone }}
            </p>
          </div>
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
              <p class="text-primary font-black mt-1">
                 <span v-if="item.price">Rp {{ parseInt(item.price).toLocaleString('id-ID') }}</span>
                 <span v-else class="text-sm italic text-on-surface-variant">Harga Menyusul</span>
              </p>
              
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
            <div v-for="c in cartDetails" :key="c.id" class="flex flex-col bg-surface-container/50 p-3 rounded-2xl gap-2">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <span class="badge badge-primary font-bold">{{ c.quantity }}x</span>
                  <span class="text-on-surface text-sm font-medium">{{ c.name }}</span>
                </div>
                <span class="font-bold text-on-surface text-sm">Rp {{ c.total }}</span>
              </div>
              <input 
                type="text" 
                placeholder="Catatan (opsional)..."
                class="input input-xs input-bordered w-full bg-white rounded-lg text-xs font-medium" 
                v-model="c.cartRef.note" 
              />
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
            <span>Rp {{ parseInt(session?.fee || 5000).toLocaleString('id-ID') }}</span>
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
            <div class="relative flex items-center">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">call</span>
              <div class="absolute left-8 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant text-sm">+62</div>
              <input type="tel" placeholder="812345..." class="input input-bordered input-sm w-full pl-16 bg-surface focus:border-primary rounded-xl" v-model="buyer.phone" required />
            </div>
          </div>
        </div>

        <!-- Action Button -->
        <button 
          class="btn btn-primary w-full h-16 rounded-full text-lg shadow-xl shadow-primary/30 group"
          :disabled="cart.length === 0 || !buyer.name || !buyer.phone || isLoading || isPast || isClosed"
          @click="submitOrder"
        >
          <span v-if="isLoading" class="loading loading-spinner"></span>
          <span v-else-if="isPast || isClosed">Session Closed</span>
          <span v-else>Place Order</span>
          <span v-if="!isPast && !isClosed" class="material-symbols-outlined group-hover:translate-x-2 transition-transform">send</span>
        </button>
        <p v-if="isPast || isClosed" class="text-center text-error text-sm font-bold mt-2">Sesi ini sudah ditutup, tidak bisa menerima order baru.</p>
      </div>
    </aside>


  </div>
</template>

<script setup>
const { getSession, placeOrder } = useApi();
const { user, syncUser } = useAuth();
const route = useRoute();

const session = ref(null);
const menu = ref([]);
const cart = ref([]);
const buyer = ref({ name: '', phone: '' });
const isLoading = ref(false);

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

        // Load cart from localStorage
        if (process.client) {
            const savedCart = localStorage.getItem(`jastipcoy_cart_${id}`);
            if (savedCart) {
                cart.value = JSON.parse(savedCart);
            }
        }
    } catch (error) {
        console.error('Failed to fetch session', error);
    }
};

onMounted(async () => {
    await fetchData();
    syncUser();
    if (user.value) {
        buyer.value.name = user.value.name || '';
        
        // Try to fetch latest user data to get phone number
        try {
            const api = useApi();
            const userData = await api.getUser(user.value.id);
            if (userData && userData.phone) {
                let phone = userData.phone;
                if (phone.startsWith('62')) {
                    phone = phone.substring(2);
                }
                buyer.value.phone = phone;
            } else {
                // Fallback to localStorage
                let phone = user.value.phone || '';
                if (phone.startsWith('62')) {
                    phone = phone.substring(2);
                }
                buyer.value.phone = phone;
            }
        } catch (e) {
            console.error('Failed to fetch user data', e);
            // Fallback to localStorage
            let phone = user.value.phone || '';
            if (phone.startsWith('62')) {
                phone = phone.substring(2);
            }
            buyer.value.phone = phone;
        }
    }
});

// Watch cart changes and save to localStorage
watch(cart, (newCart) => {
    if (process.client) {
        localStorage.setItem(`jastipcoy_cart_${route.params.id}`, JSON.stringify(newCart));
    }
}, { deep: true });

const getQuantity = (id) => cart.value.find(c => c.id === id)?.quantity || 0;

const updateQuantity = (id, delta) => {
  const existing = cart.value.find(c => c.id === id);
  if (existing) {
    existing.quantity += delta;
    if (existing.quantity <= 0) {
      cart.value = cart.value.filter(c => c.id !== id);
    }
  } else if (delta > 0) {
    cart.value.push({ id, quantity: 1, note: '' });
  }
};

const cartDetails = computed(() => {
  return cart.value.map(c => {
    const item = menu.value.find(m => m.id === c.id);
    const priceNum = parseInt(item.price) || 0;
    return {
      ...item,
      quantity: c.quantity,
      note: c.note,
      cartRef: c,
      total: priceNum ? (priceNum * c.quantity).toLocaleString('id-ID') : 'Menyusul'
    };
  });
});

const subtotalNum = computed(() => {
    return cart.value.reduce((acc, c) => {
        const item = menu.value.find(m => m.id === c.id);
        const priceNum = parseInt(item.price) || 0;
        return acc + (priceNum * c.quantity);
    }, 0);
});

const subtotal = computed(() => subtotalNum.value.toLocaleString('id-ID'));
const grandTotal = computed(() => (subtotalNum.value + parseInt(session.value?.fee || 5000)).toLocaleString('id-ID'));

const isPast = computed(() => {
    if (!session.value?.closing_time) return false;
    const parts = session.value.closing_time.split(/[-T :]/);
    if (parts.length >= 5) {
        const closingDate = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5] || 0);
        return closingDate.getTime() < new Date().getTime();
    }
    return false;
});

const isClosed = computed(() => {
    const status = session.value?.status?.toLowerCase();
    return status === 'closed' || status === 'close';
});

const formattedClosingTime = computed(() => {
    if (!session.value?.closing_time) return '';
    const parts = session.value.closing_time.split(/[-T :]/);
    if (parts.length >= 5) {
        const date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
        const formattedDate = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const formattedTime = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
        return `${formattedDate}, ${formattedTime}`;
    }
    return session.value.closing_time;
});

const submitOrder = async () => {
  try {
    isLoading.value = true;
    const orderItems = cart.value.map(c => {
        const item = menu.value.find(m => m.id === c.id);
        return {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: c.quantity,
            note: c.note || ''
        };
    });

    let phone = buyer.value.phone.trim();
    if (phone.startsWith('0')) {
      phone = phone.substring(1);
    }
    const formattedPhone = '62' + phone;

    const res = await placeOrder({
        session_id: session.value.id,
        payment_method_id: null,
        status: 'pending',
        buyer_name: buyer.value.name,
        buyer_phone: formattedPhone,
        items: JSON.stringify(orderItems),
        amount: subtotalNum.value + parseInt(session.value?.fee || 5000)
    });

    // Save to localStorage
    const savedOrders = JSON.parse(localStorage.getItem('jastipcoy_orders') || '[]');
    savedOrders.push({
        id: res.id,
        session_name: session.value.title,
        amount: subtotalNum.value + parseInt(session.value?.fee || 5000),
        status: 'pending'
    });
    localStorage.setItem('jastipcoy_orders', JSON.stringify(savedOrders));

    // Clear cart for this session
    localStorage.removeItem(`jastipcoy_cart_${session.value.id}`);

    // Langsung navigasi ke halaman status pesanan
    navigateTo(`/orders/${res.id}`);
  } catch (error) {
    alert('Gagal memesan.');
  } finally {
    isLoading.value = false;
  }
};
</script>

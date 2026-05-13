<template>
  <div class="max-w-xl mx-auto space-y-8">
    <div class="text-center space-y-2">
      <h1 class="text-4xl font-extrabold text-primary font-plus-jakarta italic">My Orders</h1>
      <p class="text-on-surface-variant font-medium tracking-tight">Track all your active and past jastip orders.</p>
    </div>

    <div class="space-y-4">
      <div v-if="orderList.length > 0" class="space-y-4">
        <NuxtLink v-for="order in orderList" :key="order.id" :to="`/orders/${order.id}`" 
          class="block bg-white rounded-[2.5rem] p-6 shadow-xl shadow-primary-container/10 border border-outline-variant/20 hover:border-primary transition-all group">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center">
                <span class="material-symbols-outlined fill">reorder</span>
              </div>
              <div>
                <div class="font-bold text-on-surface">#ORDER-{{ order.id }}</div>
                <div class="text-[10px] uppercase font-black text-secondary tracking-widest">{{ order.session_name }}</div>
              </div>
            </div>
            <span class="badge badge-primary font-bold px-4 py-3 rounded-xl border-none">{{ order.status || 'Active' }}</span>
          </div>
          
          <div class="flex justify-between items-center bg-surface-container/30 rounded-2xl p-4">
            <div class="text-sm font-medium text-on-surface-variant">Rp {{ parseInt(order.amount).toLocaleString('id-ID') }}</div>
            <span class="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty State -->
      <div v-else class="py-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-outline-variant/20">
        <span class="material-symbols-outlined text-6xl text-outline-variant/30">receipt_long</span>
        <p class="mt-4 font-bold uppercase tracking-widest text-xs text-on-surface-variant">No orders found yet</p>
        <button @click="navigateTo('/')" class="btn btn-primary rounded-full mt-6 px-10">Start Jastiping</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const orderList = ref([]);

onMounted(() => {
    const saved = localStorage.getItem('jastipcoy_orders');
    if (saved) {
        orderList.value = JSON.parse(saved).reverse();
    }
});
</script>

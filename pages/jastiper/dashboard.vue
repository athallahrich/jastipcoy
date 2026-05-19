<template>
  <div class="flex flex-col gap-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/20">
      <div>
        <h1 class="text-4xl font-extrabold text-primary font-plus-jakarta">Hello, {{ currentUser?.name || 'Jastiper' }}!</h1>
        <p class="text-on-surface-variant mt-1 flex items-center gap-1">
          <span class="material-symbols-outlined text-sm">shield_person</span>
          Pro Jastiper Mode
        </p>
      </div>
      <button 
        class="btn btn-primary rounded-full px-8 gap-2 shadow-lg shadow-primary/20"
        @click="navigateTo('/jastiper/new-session')"
      >
        <span class="material-symbols-outlined">add</span>
        New Session
      </button>
    </div>

    <!-- Stats Bento -->
    <div v-if="stats" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-primary-container text-on-primary-container p-8 rounded-[2rem] shadow-sm">
        <div class="text-sm font-bold uppercase tracking-wider opacity-70 mb-2">Total Earnings</div>
        <div class="text-4xl font-black font-plus-jakarta">Rp {{ stats.earnings.toLocaleString('id-ID') }}</div>
        <div class="mt-4 flex items-center gap-1 text-xs font-bold">
          <span class="material-symbols-outlined text-sm">trending_up</span>
          Real database data
        </div>
      </div>
      <div class="bg-secondary-container text-on-secondary-container p-8 rounded-[2rem] shadow-sm">
        <div class="text-sm font-bold uppercase tracking-wider opacity-70 mb-2">Active Orders</div>
        <div class="text-4xl font-black font-plus-jakarta">{{ stats.active_orders }}</div>
        <div class="mt-4 flex items-center gap-1 text-xs font-bold">
          <span class="material-symbols-outlined text-sm">package_2</span>
          {{ stats.active_sessions }} sessions currently live
        </div>
      </div>
      <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-outline-variant/30">
        <div class="text-sm font-bold uppercase tracking-wider text-on-surface-variant mb-2">Rating</div>
        <div class="text-4xl font-black font-plus-jakarta text-on-surface flex items-center gap-2">
          5.0
          <span class="material-symbols-outlined text-warning text-3xl fill">star</span>
        </div>
        <div class="mt-4 text-xs font-bold text-on-surface-variant">Keep up the good work!</div>
      </div>
    </div>

    <!-- Active Sessions List -->
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-on-surface font-plus-jakarta flex items-center gap-2">
        <span class="material-symbols-outlined text-primary fill">splitscreen</span>
        Live Sessions
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="session in activeSessions" 
          :key="session.id"
          class="card bg-white border-2 border-outline-variant/20 hover:border-primary/30 transition-all rounded-[2rem] p-6 group cursor-pointer"
          @click="navigateTo(`/jastiper/manage/${session.id}`)"
        >
          <div class="flex justify-between items-start mb-6">
            <div>
              <div :class="['badge badge-sm gap-1 mb-2 font-bold text-[10px]', session.status === 'closed' ? 'badge-error' : 'badge-success']">
                <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                {{ session.status.toUpperCase() }}
              </div>
              <h3 class="text-2xl font-bold text-on-surface leading-tight">{{ session.title }}</h3>
              <p class="text-sm text-on-surface-variant">{{ session.area }}</p>
              <p class="text-[10px] font-bold text-on-surface-variant uppercase mt-1">Closes at: {{ session.closing_time ? new Date(session.closing_time.replace(' ', 'T')).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) : '-' }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="bg-surface-container p-4 rounded-2xl">
              <div class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Orders</div>
              <div class="text-xl font-bold flex items-center gap-2">
                {{ session.orderCount }}
                <span class="material-symbols-outlined text-primary text-sm">shopping_bag</span>
              </div>
            </div>
            <div class="bg-surface-container p-4 rounded-2xl">
              <div class="text-[10px] font-bold text-on-surface-variant uppercase mb-1">Capacity</div>
              <div class="text-xl font-bold flex items-center gap-2 text-secondary">
                {{ session.capacity }}%
                <span class="material-symbols-outlined text-sm fill">group</span>
              </div>
            </div>
          </div>

          <!-- Capacity Bar -->
          <div class="space-y-2">
            <div class="flex justify-between text-[10px] font-bold uppercase text-on-surface-variant">
              <span>{{ session.capacity }}% Used</span>
              <span>{{ session.slotsLeft }} slots left</span>
            </div>
            <div class="w-full bg-surface-container rounded-full h-3 overflow-hidden">
              <div 
                class="bg-primary h-full rounded-full transition-all duration-1000 relative"
                :style="{ width: `${session.capacity}%` }"
              ></div>
            </div>
          </div>

          <div class="mt-6 flex gap-2">
            <button class="btn btn-primary flex-1 rounded-full btn-sm" @click.stop="navigateTo(`/jastiper/manage/${session.id}`)">Manage Orders</button>
            <button v-if="session.status !== 'closed'" class="btn btn-error flex-1 rounded-full btn-sm text-white" @click.stop="closeSession(session.id)">Tutup Sesi</button>
          </div>
        </div>
        <div v-if="activeSessions.length === 0" class="col-span-full text-center py-20 bg-white rounded-[2rem] border-2 border-dashed border-outline-variant/30">
          <p class="text-on-surface-variant italic">Belum ada sesi aktif. Yuk buka jastip!</p>
        </div>
      </div>
    </div>

    <!-- Recent Orders List -->
    <div v-if="stats && stats.recent_orders.length > 0" class="space-y-6 pb-12">
      <h2 class="text-2xl font-bold text-on-surface font-plus-jakarta flex items-center gap-2">
        <span class="material-symbols-outlined text-primary fill">history</span>
        Recent Orders
      </h2>
      
      <div class="bg-white border-2 border-outline-variant/20 rounded-[2.5rem] overflow-hidden">
        <table class="table table-zebra w-full mb-0">
          <thead>
            <tr class="bg-surface-container border-b-2 border-outline-variant/30">
              <th class="font-bold text-xs uppercase tracking-widest text-on-surface-variant p-6">Buyer</th>
              <th class="font-bold text-xs uppercase tracking-widest text-on-surface-variant p-6">Session</th>
              <th class="font-bold text-xs uppercase tracking-widest text-on-surface-variant p-6 text-right">Amount</th>
              <th class="font-bold text-xs uppercase tracking-widest text-on-surface-variant p-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in stats.recent_orders" :key="order.id" class="hover:bg-surface-container/30 transition-colors">
              <td class="p-6">
                <div class="font-bold text-on-surface">{{ order.buyer_name }}</div>
                <div class="text-[10px] text-on-surface-variant">{{ order.buyer_phone }}</div>
              </td>
              <td class="p-6">
                <div class="text-sm text-on-surface-variant">{{ order.session_name }}</div>
              </td>
              <td class="p-6 text-right font-black text-secondary">
                Rp {{ parseInt(order.amount).toLocaleString('id-ID') }}
              </td>
              <td class="p-6 text-center">
                <div :class="['badge font-bold text-[10px] badge-sm uppercase', order.status === 'completed' ? 'badge-success' : 'badge-warning']">
                  {{ order.status }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getDashboardStats, getSessions, updateSessionStatus } = useApi();
const stats = ref(null);
const activeSessions = ref([]);
const currentUser = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem('jastiper_user'));
    currentUser.value = user;
    if (!user) {
      navigateTo('/register');
      return;
    }
    
    // Fetch stats
    stats.value = await getDashboardStats(user.id);
    
    // Fetch all active sessions for this jastiper
    const sessions = await getSessions(`?jastiper_id=${user.id}`);
    activeSessions.value = sessions.map(s => {
      let isPast = false;
      if (s.closing_time) {
        const parts = s.closing_time.split(/[-T :]/);
        if (parts.length >= 5) {
          const closingDate = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5] || 0);
          isPast = closingDate.getTime() < new Date().getTime();
        }
      }
      const statusLower = s.status ? s.status.toLowerCase() : '';
      const isClosedInDB = statusLower === 'closed' || statusLower === 'close';
      const displayStatus = (isPast || isClosedInDB) ? 'closed' : 'open';
      return {
        id: s.id,
        title: s.title,
        area: s.location_name || 'Assigned Area',
        orderCount: s.total_slots - s.slots_available,
        capacity: Math.round(((s.total_slots - s.slots_available) / s.total_slots) * 100),
        slotsLeft: s.slots_available,
        status: displayStatus,
        closing_time: s.closing_time
      };
    });

  } catch (error) {
    console.error('Failed to fetch dashboard data', error);
  } finally {
    isLoading.value = false;
  }
});

const closeSession = async (sessionId) => {
  if (confirm('Yakin ingin menutup sesi jastip ini?')) {
    try {
      await updateSessionStatus(sessionId, 'closed');
      // Refresh data
      const user = JSON.parse(localStorage.getItem('jastiper_user'));
      stats.value = await getDashboardStats(user.id);
      const sessions = await getSessions(`?jastiper_id=${user.id}`);
      activeSessions.value = sessions.map(s => {
        let isPast = false;
        if (s.closing_time) {
          const parts = s.closing_time.split(/[-T :]/);
          if (parts.length >= 5) {
            const closingDate = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5] || 0);
            isPast = closingDate.getTime() < new Date().getTime();
          }
        }
        const statusLower = s.status ? s.status.toLowerCase() : '';
        const isClosedInDB = statusLower === 'closed' || statusLower === 'close';
        const displayStatus = (isPast || isClosedInDB) ? 'closed' : 'open';
        return {
          id: s.id,
          title: s.title,
          area: s.location_name || 'Assigned Area',
          orderCount: s.total_slots - s.slots_available,
          capacity: Math.round(((s.total_slots - s.slots_available) / s.total_slots) * 100),
          slotsLeft: s.slots_available,
          status: displayStatus,
          closing_time: s.closing_time
        };
      });
      alert('Sesi berhasil ditutup');
    } catch (error) {
      alert('Gagal menutup sesi: ' + error.message);
    }
  }
};
</script>

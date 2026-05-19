<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold text-on-surface font-plus-jakarta">Active Jastips</h1>
      <div class="flex items-center gap-2 mt-2">
        <p class="text-on-surface-variant flex items-center gap-1">
          Delivering to <span class="font-bold text-primary">{{ locationName }}</span>
        </p>
        <button @click="navigateTo('/')" class="btn btn-xs bth-ghost text-primary lowercase font-bold hover:bg-primary-container px-2 rounded-full">
          Ganti Area <span class="material-symbols-outlined text-xs">edit</span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
      <button class="btn btn-primary btn-sm rounded-full capitalize">All Items</button>
      <button class="btn btn-ghost btn-sm rounded-full bg-surface-container-high capitalize">Coffee & Drinks</button>
      <button class="btn btn-ghost btn-sm rounded-full bg-surface-container-high capitalize">Lunch Boxes</button>
    </div>

    <ClientOnly>
      <!-- Jastip Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="session in sessions" 
          :key="session.id"
          v-motion
          :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0 }"
          v-motion-hover="{ y: -10 }"
          :class="['card bg-white shadow-xl transition-all border cursor-pointer', (session.status === 'closed' || session.isPast) ? 'opacity-70 grayscale-[0.3] border-outline-variant/50 cursor-not-allowed' : 'hover:shadow-2xl border-outline-variant/20']"
          @click="(!session.isPast && session.status !== 'closed') ? navigateTo(`/order/${session.id}`) : null"
        >
          <div class="card-body p-6">
            <!-- Card Header -->
            <div class="flex items-center gap-3 mb-4">
              <div class="avatar">
                <div class="w-12 rounded-full ring ring-primary-container ring-offset-base-100 ring-offset-2">
                  <img :src="session.jastiper.avatar" :alt="session.jastiper.name" />
                </div>
              </div>
              <div class="flex-grow">
                <h3 class="font-bold text-on-surface">{{ session.jastiper.name }}</h3>
                <div class="flex items-center gap-3 text-xs text-on-surface-variant">
                  <div class="flex items-center gap-1">
                    <span class="material-symbols-outlined text-warning fill" style="font-size: 12px !important;">star</span>
                    {{ session.jastiper.rating }}
                  </div>
                  <div v-if="session.jastiper_phone" class="flex items-center gap-1 font-bold">
                    <span class="material-symbols-outlined" style="font-size: 12px !important;">call</span>
                    {{ session.jastiper_phone }}
                  </div>
                </div>
              </div>
              <div :class="['badge badge-sm gap-1 uppercase font-bold', session.status === 'closed' ? 'badge-error text-white' : (session.status === 'Closing Soon' ? 'badge-warning' : 'badge-success text-white')]">
                <span class="material-symbols-outlined" style="font-size: 10px !important;">{{ session.statusIcon }}</span>
                {{ session.status === 'closed' ? 'Closed' : 'Open' }}
              </div>
            </div>

            <!-- Main Item -->
            <div class="bg-surface-container rounded-2xl p-4 flex items-center gap-4 border border-surface-dim mb-4">
              <div class="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                <img :src="session.mainItem.image" class="w-full h-full object-cover" />
              </div>
              <div>
                <h4 class="font-bold text-lg text-on-surface leading-tight">{{ session.title }}</h4>
                <p class="text-sm text-on-surface-variant truncate w-40">{{ session.description }}</p>
              </div>
            </div>

            <!-- Footer Stats -->
            <div class="flex justify-between items-center pt-4 border-t border-outline-variant/30 mt-auto">
              <div class="flex items-center gap-2" :class="session.slotsLeft === 0 ? 'text-outline/50' : (session.slotsLeft <= 2 ? 'text-primary' : 'text-secondary')">
                <span class="material-symbols-outlined fill">{{ session.slotsLeft === 0 ? 'group_off' : 'group' }}</span>
                <div>
                  <div class="text-sm font-bold leading-none">
                    <span v-if="session.slotsLeft === 0">FULL</span>
                    <span v-else>{{ session.slotsLeft }} Slots Left</span>
                  </div>
                  <div class="text-[10px] text-on-surface-variant font-normal">of {{ session.totalSlots }} total</div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-[10px] text-on-surface-variant uppercase font-bold">Closes at</div>
                <div class="font-bold text-on-surface text-sm">{{ session.closing_time ? new Date(session.closing_time).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'}) : '-' }}</div>
              </div>
            </div>
          </div>
          <!-- Overlay for FULL state -->
          <div v-if="session.slotsLeft === 0 && session.status !== 'closed'" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[inherit] z-10 flex items-center justify-center pointer-events-none">
            <div class="bg-outline text-white px-6 py-2 rounded-full font-black text-sm tracking-widest shadow-lg -rotate-12">FULL HOUSE</div>
          </div>
          <!-- Overlay for CLOSED state -->
          <div v-if="session.status === 'closed' || session.isPast" class="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
            <div class="bg-error text-white px-6 py-2 rounded-full font-black text-sm tracking-widest shadow-lg -rotate-12 translate-y-10">SESSION CLOSED</div>
          </div>
        </div>
      </div>

      <!-- Floating Action Button -->
      <button 
        v-motion
        v-motion-hover="{ scale: 1.1 }"
        v-motion-active="{ scale: 0.95 }"
        class="fixed bottom-24 right-6 z-40 btn btn-circle btn-primary btn-lg shadow-2xl"
        @click="navigateTo('/jastiper/new-session')"
      >
        <span class="material-symbols-outlined text-3xl">add</span>
      </button>
    </ClientOnly>
  </div>
</template>

<script setup>
const { getSessions } = useApi();
const route = useRoute();
const locationName = computed(() => route.query.location || 'All Areas');
const sessions = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const token = route.query.token;
    const location = route.query.location;
    const locationId = route.query.location_id;
    let queryParams = [];
    
    if (token) queryParams.push(`token=${token}`);
    if (locationId) queryParams.push(`location_id=${locationId}`);
    else if (location) queryParams.push(`location_name=${encodeURIComponent(location)}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    
    const res = await getSessions(queryString);
    sessions.value = Array.isArray(res) ? res : [res].filter(s => s != null);
    
    // map some UI fields that might be missing from DB
    sessions.value = sessions.value.map(s => {
      // Check if time has passed
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
      const isSlotsEmpty = s.slots_available <= 0;
      const displayStatus = (isPast || isClosedInDB || isSlotsEmpty) ? 'closed' : 'open';
      
      return {
        ...s,
        status: displayStatus,
        isPast: isPast,
        statusIcon: displayStatus === 'closed' ? 'block' : (displayStatus === 'Closing Soon' ? 'timer' : 'shopping_bag'),
        jastiper: { 
          name: s.jastiper_name || 'Jastiper', 
          rating: 5.0, 
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}` 
        },
        mainItem: s.mainItem || { image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=200&h=200&fit=crop' },
        slotsLeft: s.slots_available,
        totalSlots: s.total_slots
      };
    });
  } catch (error) {
    console.error('Failed to fetch sessions');
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

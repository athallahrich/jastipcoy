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
          class="card bg-white shadow-xl hover:shadow-2xl transition-all border border-outline-variant/20 cursor-pointer"
          @click="navigateTo(`/order/${session.id}`)"
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
                <div class="flex items-center gap-1 text-xs text-on-surface-variant">
                  <span class="material-symbols-outlined text-[14px] text-warning fill">star</span>
                  {{ session.jastiper.rating }}
                </div>
              </div>
              <div :class="['badge badge-sm gap-1', session.status === 'Closing Soon' ? 'badge-warning' : 'badge-ghost bg-surface-variant']">
                <span class="material-symbols-outlined text-[14px]">{{ session.statusIcon }}</span>
                {{ session.status }}
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
                <div class="font-bold text-on-surface">{{ session.closingTime }}</div>
              </div>
            </div>
          </div>
          <!-- Overlay for FULL state -->
          <div v-if="session.slotsLeft === 0" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-[inherit] z-10 flex items-center justify-center pointer-events-none">
            <div class="bg-outline text-white px-6 py-2 rounded-full font-black text-sm tracking-widest shadow-lg -rotate-12">FULL HOUSE</div>
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
    sessions.value = sessions.value.map(s => ({
      ...s,
      statusIcon: s.status === 'Closing Soon' ? 'timer' : 'shopping_bag',
      jastiper: s.jastiper || { name: 'Jastiper', rating: 5.0, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${s.id}` },
      mainItem: s.mainItem || { image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?w=200&h=200&fit=crop' }
    }));
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

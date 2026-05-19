<template>
  <div class="flex flex-col items-center justify-center min-h-[70vh] text-center pt-8">
    <!-- Hero Section -->
    <div class="max-w-2xl mb-12">
      <h1 class="text-4xl md:text-6xl font-black text-primary mb-6 font-plus-jakarta tracking-tighter italic">Where to today? 🌸</h1>
      <p class="text-lg md:text-xl text-on-surface-variant font-medium leading-relaxed">Pilih lokasi pengantaran kamu untuk melihat sesi jastip yang tersedia di sekitarmu!</p>
    </div>

    <ClientOnly>
      <!-- Illustration -->
      <div 
        class="relative w-64 h-64 mx-auto mb-12 rounded-[3.5rem] overflow-hidden bg-primary-container shadow-2xl shadow-primary/20 rotate-3"
      >
        <img 
          src="/logocute.png" 
          alt="Delivery" 
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div class="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
      </div>
    </ClientOnly>

    <!-- Location Selection Grid -->
    <div class="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 px-4">
      <ClientOnly>
        <button 
          v-for="loc in locations" 
          :key="loc.id"
          class="group bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] shadow-xl hover:shadow-2xl hover:shadow-primary/20 border-4 border-transparent hover:border-primary transition-all text-center flex flex-col items-center gap-4"
          :class="{ 'border-primary shadow-2xl shadow-primary/10': loc.selected }"
          @click="selectLocation(loc)"
        >
          <div :class="['w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-lg', loc.selected ? 'bg-primary text-white scale-110' : 'bg-surface-container-high text-primary group-hover:bg-primary group-hover:text-white']">
            <span class="material-symbols-outlined text-3xl fill">{{ loc.icon }}</span>
          </div>
          <div>
            <h3 class="font-black text-on-surface text-lg">{{ loc.name }}</h3>
            <p class="text-xs text-on-surface-variant opacity-70 mt-1">{{ loc.sub_name }}</p>
          </div>
          <div v-if="loc.selected" class="badge badge-primary font-bold text-[10px] uppercase tracking-widest mt-auto">Aktif</div>
        </button>
      </ClientOnly>
    </div>

    <!-- Action Banner & Add New Spot Form -->
    <div class="w-full max-w-4xl space-y-6 px-4 mb-20">
      <div class="bg-white/50 backdrop-blur-md p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border-4 border-dashed border-primary/20 shadow-sm">
        <button 
          class="w-full flex items-center justify-between transition-all group"
          @click="isAddingSpot = !isAddingSpot"
        >
          <div class="flex items-center gap-4 md:gap-6">
            <div :class="['w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center transition-all duration-500 shadow-lg', isAddingSpot ? 'bg-error text-white rotate-45' : 'bg-primary text-white group-hover:rotate-12']">
              <span class="material-symbols-outlined text-3xl md:text-4xl">{{ isAddingSpot ? 'close' : 'add_location' }}</span>
            </div>
            <div class="text-left">
              <h3 class="text-xl md:text-2xl font-black text-on-surface">{{ isAddingSpot ? 'Batal Tambah' : 'Tambah Lokasi Baru' }}</h3>
              <p class="text-sm md:text-base text-on-surface-variant font-medium">Kampus, gym, atau tempat seru lainnya!</p>
            </div>
          </div>
          <span v-if="!isAddingSpot" class="material-symbols-outlined text-primary text-3xl md:text-4xl group-hover:translate-x-2 transition-transform">chevron_right</span>
        </button>

        <ClientOnly>
          <div v-if="isAddingSpot" class="mt-10 space-y-8 overflow-hidden text-left">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="label"><span class="label-text font-bold text-on-surface-variant">Nama Lokasi</span></label>
                <input type="text" placeholder="Misal: Kantor Tower B" class="input input-lg input-bordered bg-white focus:border-primary rounded-[2rem] border-2" v-model="newSpot.name" />
              </div>
              <div class="form-control">
                <label class="label"><span class="label-text font-bold text-on-surface-variant">Detail Lokasi</span></label>
                <input type="text" placeholder="Misal: Dekat Lobby Utara" class="input input-lg input-bordered bg-white focus:border-primary rounded-[2rem] border-2" v-model="newSpot.sub_name" />
              </div>
            </div>
            <div class="flex justify-end gap-4">
              <button class="btn btn-ghost btn-lg rounded-full px-10" @click="isAddingSpot = false">Batal</button>
              <button class="btn btn-primary btn-lg rounded-full px-12 shadow-xl shadow-primary/30" @click="addNewSpot">Simpan Lokasi ✨</button>
            </div>
          </div>
        </ClientOnly>
      </div>

      <!-- Become Jastiper CTA -->
      <ClientOnly>
        <button 
          class="w-full bg-secondary text-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all shadow-xl shadow-secondary/20 group"
          @click="navigateTo(user ? '/jastiper/dashboard' : '/register')"
        >
          <div class="flex items-center gap-4 md:gap-6">
            <div class="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform shrink-0">
              <span class="material-symbols-outlined text-3xl md:text-4xl fill">{{ user ? 'space_dashboard' : 'auto_awesome' }}</span>
            </div>
            <div class="text-left">
              <h3 class="text-xl md:text-2xl font-black tracking-tight">{{ user ? 'Ke Dashboard Jastiper' : 'Masuk / Daftar Jastiper' }}</h3>
              <p class="text-sm md:text-base text-white/80 font-medium italic">
                {{ user ? 'Pantau orderan dan aktifkan sesi jastipmu! 🚀' : 'Dapatkan penghasilan tambahan sambil jajan! ✨' }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3 font-black text-xs md:text-sm uppercase tracking-widest bg-white/20 px-4 py-2 md:px-6 md:py-3 rounded-full self-end md:self-auto">
            {{ user ? 'Buka Dashboard' : 'Klik di sini' }}
            <span class="material-symbols-outlined text-xs md:text-sm">arrow_forward_ios</span>
          </div>
        </button>
      </ClientOnly>
    </div>


  </div>
</template>

<script setup>
const { user, syncUser } = useAuth();
const { getLocations, createLocation } = useApi();

const locations = ref([]);
const isAddingSpot = ref(false);
const newSpot = ref({ name: '', sub_name: '' });

const loadLocations = async () => {
  try {
    const data = await getLocations();
    locations.value = data.map((l, index) => ({
      ...l,
      selected: index === 0 // Default select first one if any
    }));
  } catch (error) {
    console.error('Failed to load locations:', error);
  }
};

onMounted(() => {
  syncUser();
  loadLocations();
});

const selectLocation = (loc) => {
  locations.value.forEach(l => l.selected = l.id === loc.id);
  navigateTo({
    path: '/sessions',
    query: { 
      location_id: loc.id,
      location: loc.name 
    }
  });
};

const addNewSpot = async () => {
  if (newSpot.value.name) {
    try {
      await createLocation({
        name: newSpot.value.name,
        sub_name: newSpot.value.sub_name,
        icon: 'location_on' // Default icon for new locations
      });
      
      newSpot.value = { name: '', sub_name: '' };
      isAddingSpot.value = false;
      await loadLocations(); // Refresh list
    } catch (error) {
      alert('Gagal menambah lokasi baru.');
    }
  }
};
</script>

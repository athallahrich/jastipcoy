<template>
  <div class="min-h-screen bg-background font-vietnam">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useSeoMeta({
  title: 'JastipCoyy - Jasa Titip Office Paling Unyu ✨',
  description: 'Cara terseru dan termudah buat jastip makanan di kantor atau kampus kamu!',
  ogTitle: 'JastipCoyy ✨',
  ogDescription: 'Jasa Titip Office Paling Unyu',
  ogImage: 'https://images.unsplash.com/photo-1594914141271-9658dbbc9103?w=512&h=512&fit=crop',
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
@import 'material-symbols/outlined.css';

.material-symbols-outlined {
  font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

/* Driver.js Custom Theme */
.driver-popover {
  border-radius: 1.5rem !important;
  padding: 1.5rem !important;
  box-shadow: 0 20px 25px -5px rgb(236 72 153 / 0.1), 0 8px 10px -6px rgb(236 72 153 / 0.1) !important;
  border: 2px solid rgb(236 72 153 / 0.1) !important;
}
.driver-popover-title {
  font-family: 'Plus Jakarta Sans', sans-serif !important;
  font-weight: 800 !important;
  font-size: 1.25rem !important;
  color: #e91e63 !important; /* matches primary color */
  margin-bottom: 0.75rem !important;
}
.driver-popover-description {
  font-family: 'Be Vietnam Pro', sans-serif !important;
  color: #4b5563 !important;
  line-height: 1.6 !important;
  font-size: 0.875rem !important;
}
.driver-popover-footer button {
  border-radius: 9999px !important;
  font-family: 'Be Vietnam Pro', sans-serif !important;
  font-weight: 700 !important;
  padding: 0.5rem 1.25rem !important;
  text-shadow: none !important;
  transition: all 0.2s !important;
}
.driver-popover-next-btn {
  background-color: #e91e63 !important;
  color: white !important;
  border: none !important;
}
.driver-popover-next-btn:hover {
  background-color: #d81b60 !important;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3) !important;
}
.driver-popover-prev-btn {
  background-color: transparent !important;
  color: #e91e63 !important;
  border: 1px solid rgba(233, 30, 99, 0.3) !important;
}
.driver-popover-prev-btn:hover {
  background-color: rgba(233, 30, 99, 0.05) !important;
}
.driver-popover-close-btn {
  color: #9ca3af !important;
}
.driver-popover-close-btn:hover {
  color: #e91e63 !important;
}
</style>

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
</style>

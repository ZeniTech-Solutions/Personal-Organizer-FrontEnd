<template>
    <div>
      <LayoutShellHeaderOnlyLOGO />
      <section
        class="bg-grayOffWhite-1 flex flex-col justify-center items-center py-20 bg-cover "
      >
        <AuthRegister />
      </section>
      <LayoutShellFooter />
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: false,
  });
  </script>
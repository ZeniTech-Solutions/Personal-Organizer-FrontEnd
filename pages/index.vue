<template>
    <div class="bg-gray-50">
      <LayoutShellHeaderOnlyLOGO />
      <section
        class="bg-grayOffWhite flex flex-col justify-center items-center py-20 bg-cover "
      >
        <AuthLogin />
      </section>
      <LayoutShellFooter />
    </div>
  </template>
  
  <script setup lang="ts">
  definePageMeta({
    layout: false,
    // middleware: "login", 
  });
  </script>
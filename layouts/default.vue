<template>
    <div>
        <Sidebar @sidebar-collapsed="(a) => isSidebarCollapsed = a" />
        <div 
            :class="isSidebarCollapsed ? 'md:ml-32' : 'md:ml-80'" 
            class="transition-all duration-300 ease-in-out"
        >
            <slot />
        </div>
    </div>
</template>
<script setup lang="ts">
    const isSidebarCollapsed = ref(false)
</script>
<script setup>

</script>

<template>
  <router-view></router-view>
</template>

<style>
body {
  background-color: #f4f4f4;
}

#nprogress .bar {
  background-color: #f4f4f4 !important;
  height: 3px !important;
}

::-webkit-scrollbar {
  width: 4px;
  height: 6px;
}

::-webkit-scrollbar-corner {
  display: block;
}

::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0,0.4);
}

::-webkit-scrollbar-track {
  border-right-color: transparent;
  border-left-color: transparent;
  background-color: rgba(0, 0, 0, 0.1);
}
</style>

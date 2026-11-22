<template>
  <div class="grain-bg">
    <div class="wave" aria-hidden="true">
      <div class="grain"></div>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.grain-bg {
  position: relative;
  isolation: isolate;
  display: flow-root;
}

.wave {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-color: #bf7ed2;
  background-image: url('../assets/wave.webp');
  background-size: cover;
}

.grain {
  position: absolute;
  inset: 0;
  background-image: url('../assets/grain.webp');
  background-size: 150px 150px;
  opacity: 0.38;
  mix-blend-mode: overlay;
}
</style>

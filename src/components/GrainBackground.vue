<template>
  <div class="grain-bg">
    <div class="grain-bg__wave" aria-hidden="true">
      <div class="grain-bg__grain"></div>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.grain-bg {
  position: relative;
  isolation: isolate;
  min-height: 100dvh;
  display: flow-root;
}

.grain-bg__wave {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-color: #bf7ed2;
  background-image: url('/images/wave.webp');
  background-size: cover;
}

.grain-bg__grain {
  position: absolute;
  inset: 0;
  background-image: url('/images/grain.webp');
  background-size: 150px 150px;
  opacity: 0.38;
  mix-blend-mode: overlay;
}
</style>

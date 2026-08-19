<script setup lang="ts">
import { computed } from "vue";

/**
 * Abstract geometric backdrop: concentric amber rings + an optional signature
 * arc, a soft depth radial, an optional diagonal axis line and film grain.
 * Purely decorative (aria-hidden), sits behind content, respects reduced motion.
 */
const props = withDefaults(
  defineProps<{
    corner?: "tr" | "tl" | "br" | "bl";
    size?: "sm" | "md" | "lg";
    arc?: boolean;
    axis?: boolean;
    spin?: boolean;
    grain?: boolean;
  }>(),
  {
    corner: "tr",
    size: "lg",
    arc: true,
    axis: false,
    spin: true,
    grain: true,
  },
);

const ringPosition = computed(
  () =>
    ({
      tr: "-top-44 -right-36",
      tl: "-top-44 -left-36",
      br: "-bottom-44 -right-36",
      bl: "-bottom-44 -left-36",
    })[props.corner],
);

const ringSize = computed(
  () =>
    ({
      sm: "h-[18rem] w-[18rem] md:h-[26rem] md:w-[26rem]",
      md: "h-[28rem] w-[28rem] md:h-[42rem] md:w-[42rem]",
      lg: "h-[38rem] w-[38rem] md:h-[58rem] md:w-[58rem]",
    })[props.size],
);

const secondaryPosition = computed(
  () =>
    ({
      tr: "-bottom-16 -left-16",
      tl: "-bottom-16 -right-16",
      br: "-top-16 -left-16",
      bl: "-top-16 -right-16",
    })[props.corner],
);

const depthOrigin = computed(
  () =>
    ({
      tr: "72% 28%",
      tl: "28% 28%",
      br: "72% 72%",
      bl: "28% 72%",
    })[props.corner],
);
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    aria-hidden="true"
  >
    <div
      class="absolute inset-0"
      :style="{
        background: `radial-gradient(46% 42% at ${depthOrigin}, oklch(0.75 0.17 70 / 11%), transparent 70%)`,
      }"
    />
    <svg
      class="geo-rings absolute"
      :class="[ringPosition, ringSize, { spin }]"
      viewBox="0 0 400 400"
      fill="none"
    >
      <circle cx="200" cy="200" r="199" stroke="var(--color-accent)" stroke-opacity="0.22" stroke-width="0.6" />
      <circle cx="200" cy="200" r="152" stroke="var(--color-accent)" stroke-opacity="0.14" stroke-width="0.6" />
      <circle cx="200" cy="200" r="104" stroke="var(--color-accent)" stroke-opacity="0.1" stroke-width="0.6" />
      <circle cx="200" cy="200" r="52" stroke="var(--color-accent)" stroke-opacity="0.38" stroke-width="0.8" />
      <path
        v-if="arc"
        d="M349 118 A170 170 0 0 1 286 349"
        stroke="var(--color-accent)"
        stroke-opacity="0.55"
        stroke-width="2"
        stroke-linecap="round"
      />
      <circle cx="200" cy="200" r="4" fill="var(--color-accent)" fill-opacity="0.7" />
    </svg>
    <svg
      class="absolute h-56 w-56 md:h-72 md:w-72"
      :class="secondaryPosition"
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="49" stroke="var(--color-accent)" stroke-opacity="0.1" stroke-width="0.4" />
      <circle cx="50" cy="50" r="30" stroke="var(--color-accent)" stroke-opacity="0.14" stroke-width="0.4" />
    </svg>
    <div v-if="axis" class="geo-axis" />
    <div v-if="grain" class="grain absolute inset-0" />
  </div>
</template>

<style scoped>
.geo-rings {
  transform-origin: center;
}

.geo-axis {
  position: absolute;
  top: -20%;
  left: 46%;
  height: 140%;
  width: 1px;
  transform: rotate(14deg);
  background: linear-gradient(
    to bottom,
    transparent,
    oklch(0.75 0.17 70 / 12%),
    transparent
  );
}

@media (prefers-reduced-motion: no-preference) {
  .geo-rings.spin {
    animation: geo-spin 140s linear infinite;
  }
}

@keyframes geo-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

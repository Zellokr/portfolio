<script setup lang="ts">
import { onMounted, ref } from "vue";
import CarViewer from "./CarViewer.client.vue";
import CarViewerSkeleton from "./CarViewerSkeleton.vue";

const visible = ref(false);
const wrapperEl = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const el = wrapperEl.value;
  if (!el || typeof IntersectionObserver === "undefined") {
    visible.value = true;
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        visible.value = true;
        observer.disconnect();
      }
    },
    { rootMargin: "200px" },
  );
  observer.observe(el);
});
</script>

<template>
  <section
    id="mi-coche"
    aria-label="Car"
    class="section border-b border-slate-800"
  >
    <div class="page-container">
      <h2 class="section-heading">Mi coche: KIA Rio 2019</h2>
      <p class="mt-3 max-w-2xl text-slate-400">
        Otra de mis pasiones fuera del código, puedes interactuar con el coche
        en 3D, rotarlo, hacer zoom y ver los detalles de su interior.
      </p>
      <div ref="wrapperEl" class="mt-8">
        <CarViewerSkeleton v-if="!visible" />
        <ClientOnly v-else>
          <CarViewer />
          <template #fallback>
            <CarViewerSkeleton />
          </template>
        </ClientOnly>
      </div>
    </div>
  </section>
</template>

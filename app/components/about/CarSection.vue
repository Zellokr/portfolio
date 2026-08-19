<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import CarViewerSkeleton from "./CarViewerSkeleton.vue";
import SectionHeader from "./SectionHeader.vue";

const CarViewer = defineAsyncComponent({
  loader: () => import("./CarViewer.client.vue"),
  loadingComponent: CarViewerSkeleton,
});

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
      <SectionHeader
        title="Mi coche: KIA Rio 2019"
        description="Otra de mis pasiones fuera del código, los coches, puedes interactuar con el coche en 3D, rotarlo, hacer zoom y ver los detalles."
      />
      <div ref="wrapperEl" class="reveal mt-8">
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

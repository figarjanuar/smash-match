<template>
  <div class="widget-next-match">
    <div class="widget-title mb-3">
      <h3>{{ title }}</h3>
    </div>
    <div class="widget-body mb-3">
      <div class="widget-vs">
        <div class="d-flex align-items-center justify-content-around justify-content-between w-100">
          <div class="text-center">
            <img alt="image-profile" :src="image">
            <h3 class="mt-3">{{ name }}</h3>
          </div>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: [
    'title',
    'image',
    'name'
  ]
}
</script>

<style lang="scss" scoped>
.widget-next-match {
  border: 1px solid rgba(255, 255, 255, 0.1);

  .widget-title {
    padding: 16px 20px;
    background-color: #ee1e46;

    h3 {
      margin: 0;
      padding: 0;
      font-size: 16px;
      font-weight: 700;
    }
  }

  .widget-vs {
    img {
      border-radius: 50%;
      aspect-ratio: 1/1;
      width: 120px;
    }
  }
}
</style>
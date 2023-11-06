<template>
  <main>
    <div class="bottom-navbar d-flex">
      <router-link :to="{ name: 'my-match' }">My Match</router-link>
      <router-link :to="{ name: 'find-match' }">Find Match</router-link>
      <router-link :to="{ name: 'profile' }">Profile</router-link>
    </div>

    <div class="container mt-3">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.bottom-navbar {
  position: fixed;
  background: var(--primary-color);
  width: 100%;
  left: 0;
  z-index: 100;
  bottom: 0;
  padding: 20px 10px;
  justify-content: space-around;
  box-shadow: 3px 5px 20px 0px rgba(255, 255, 255, 0.3);
  
  div, a {
    color: var(--vt-c-white-soft);
    text-decoration: none;
  }
}

.container {
  margin-bottom: 50px;
}
</style>

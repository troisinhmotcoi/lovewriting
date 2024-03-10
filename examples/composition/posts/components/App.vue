<template>
   <div id="app">
    <Sidebar />
    <div class="main-content">
      <Post/>
    </div>
  </div>
 
</template>

<script>

import Post from './Post.vue'
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';

export default {
  components: { Post,
    Sidebar,
    Navbar, }
}
</script>




<style>
#app {
  display: flex;
}

.main-content {
  flex: 1;
  padding: 20px;
}
</style>

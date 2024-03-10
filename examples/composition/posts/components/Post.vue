<template>
  <div>
    <label for="privacy">Privacy:</label>


    <select v-model="selectedOption" id="privacy" @change="handleChange">
      <option v-for="(option, index) in privacyOptions" :key="index" :value="option.name">
        {{ option.name }}
      </option>
    </select>
    <!-- Add a "Select All" checkbox -->
    <input type="checkbox" v-model="selectAll" @change="toggleSelectAll"> Select All

    <ul>
      <li v-for="post in posts" :key="post.id">
        <input type="checkbox" v-model="post.selected">

        {{ post.created_time }} -  {{ post.id }} - {{ post.message }}
        <br>

      </li>

    </ul>
    <button @click="deleteSelectedItems">Delete Selected</button>

    <button @click="previousPage" :disabled="isFirstPage">Previous</button>
    <button @click="nextPage">Next</button>
  </div>
</template>


<script>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const store = useStore()

    const posts = computed(() => store.state.posts)
    const status = computed(() => store.state.loginStatus)

  
    const selectAll = ref(false);

    const selectedOption = ref('EVERYONE');
; // Add a reactive variable to track current page number

    onMounted(async () => {
      try {
        await store.dispatch('getInit');
        // getInit đã hoàn thành, tiếp tục với getPosts
        await store.dispatch('getPost1st', { loginStatus: status.value, privacy: 'EVERYONE' });
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    });

    const privacyOptions = ref([
      { id: 1, name: 'EVERYONE' },
      { id: 2, name: 'ALL_FRIENDS' },
      { id: 3, name: 'SELF' },
      // ... more items
    ]);
    const isFirstPage = computed(() => store.state.num === 0); // Check if current page is the first page

    const previousPage = () => {
        // handle change logic here
        store.dispatch("getPostsWithUrl", { loginStatus: status.value, url:'', privacy: selectedOption.value, type: 'prev'});
    }
    const nextPage = () => {

      // handle change logic here
      store.dispatch("getPostsWithUrl", { loginStatus: status.value, url: store.state.pages.next, privacy: selectedOption.value, type: 'next'});
    };
    const toggleSelectAll = () => {
      posts.value.forEach(post => {
        post.selected = selectAll.value;
      });
    };

    const deleteSelectedItems = () => {
      const selectedIds = posts.value.filter(post => post.selected).map(post => post.id);
      console.log(selectedIds)
      if (selectedIds.length > 0) {
        // Call your Vuex action to delete selected items
        store.dispatch("deleteItems", { ids: selectedIds });
        // After deletion, you might want to update the posts or perform any necessary actions
      }
    };

    const handleChange = () => {
      // handle change logic here
      store.dispatch("getPost1st", { loginStatus: status.value, privacy: selectedOption.value });
    };
    return {
      selectedOption,
      privacyOptions,
      handleChange,
      previousPage,
      selectAll,
      toggleSelectAll,
      deleteSelectedItems,
      nextPage,
      posts,
      isFirstPage

    }
  }


}
</script>

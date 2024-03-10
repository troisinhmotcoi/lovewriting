<template>
    <div class="sidebar">
      <ul>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/users">Users</router-link></li>
        <li><router-link to="/products">Products</router-link></li>
        <!-- Add more links as needed -->
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Sidebar',

    // Sidebar component logic
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 200px;
    background-color: #333;
    color: white;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 10px;
    cursor: pointer;
  }
  
  li:hover {
    background-color: #555;
  }
  </style>
  
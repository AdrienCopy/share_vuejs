<template>
      <div class="container">
      <p>Test Page !</p>
      </div>

      <div class="container">
          <button class="share-button linkedin-button"><router-link to="/linkedin" class="router-link">LinkedIn Page</router-link></button>
          <button class="share-button facebook-button"><router-link to="/facebook" class="router-link">Facebook Page</router-link></button>
      </div>

      <div class="container">
          <button class="share-button linkedin-button"><router-link to="/shareon" class="router-link">Share</router-link></button>
          
      </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 400px;
}
</style>
  
<script>
export default {
  name: "HomePage",
};
</script>
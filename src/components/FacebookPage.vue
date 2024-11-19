<template>
    <div>
      <div class="container">
        <p>Share on Facebook width API</p>
      </div>
  
      <div class="container">
        <p id="status">{{ statusMessage }}</p>
        <input type="text" v-model="shareUrl" id="shareUrl" placeholder="Enter your URL" />
        <textarea v-model="shareText" id="shareText" placeholder="Enter your text here"></textarea>
        <input type="text" v-model="shareHashtag" id="shareHashtag" placeholder="Enter one or more hashtags" />
        <input type="file" @change="handleFileUpload" id="shareFile" />
        <button class="share-button facebook-button" @click="shareOnLinkedIn">Share on LinkedIn</button>
      </div>

      <div class="container">
        <button class="share-button back"><router-link to="/" class="router-link">Back</router-link></button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "FacebookPage",
  };
  </script>
  
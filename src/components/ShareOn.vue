<template>
    <div>
      <div id="fb-root"></div>
      <div class="container">
        <p>Share without API</p>
      </div>
  
      <div class="container">
        <input type="text" v-model="shareUrl" placeholder="Enter your URL" />
        <textarea v-model="shareText" placeholder="Enter your text here (does not work with Facebook for now)"></textarea>
        <input type="text" v-model="shareHashtag" placeholder="Enter one or more hashtags" />
        <button class="share-button linkedin-button" @click="shareOnLinkedIn">Share on LinkedIn</button>
        <button class="share-button facebook-button" @click="shareOnFacebook">Share on Facebook</button>
      </div>

      <div class="container">
        <button class="share-button back"><router-link to="/" class="router-link">Back</router-link></button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ShareOn",
    data() {
      return {
        shareUrl: "",
        shareText: "",
        shareHashtag: "",
      };
    },
    mounted() {
      // Initialiser le SDK Facebook
      window.fbAsyncInit = () => {
        FB.init({
          appId: "917242613703669",
          cookie: true,
          xfbml: true,
          version: "v21.0",
        });
  
        FB.getLoginStatus((response) => {
          if (response.status === "connected") {
            console.log("Utilisateur connecté avec succès");
          } else {
            console.log("Utilisateur non connecté");
          }
        });
      };
  
      // Charger le SDK Facebook de manière asynchrone
      (function (d, s, id) {
        let js,
          fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    },
    methods: {
      formatHashtags(hashtags) {
        return hashtags
          .split(" ")
          .map((word) => (word[0] === "#" ? word : "#" + word))
          .join(" ");
      },
      shareOnFacebook() {
        const text = encodeURIComponent(this.shareText);
        const shareUrl = encodeURIComponent(this.shareUrl);
        let shareHashtag = this.formatHashtags(this.shareHashtag);
        shareHashtag = encodeURIComponent(shareHashtag);
  
        const url = `https://www.facebook.com/dialog/feed?app_id=917242613703669&link=${shareUrl}&quote=${text}&hashtag=${shareHashtag}&display=popup`;
        window.open(url, "Partager sur Facebook", "width=626,height=436");
      },
      shareOnLinkedIn() {
        let shareHashtag = this.formatHashtags(this.shareHashtag);
        shareHashtag = encodeURIComponent(shareHashtag);
        const text = encodeURIComponent(this.shareText) + " " + shareHashtag;
        const shareUrl = encodeURIComponent(this.shareUrl);
  
        const url = `https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&text=${text}`;
        window.open(url, "Partager sur LinkedIn", "width=726,height=536");
      },
    },
  };
  </script>
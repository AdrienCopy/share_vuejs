<template>
    <div>
      <div class="container">
        <p>Share on LinkedIn width API</p>
      </div>
  
      <div class="container">
        <p id="status">{{ statusMessage }}</p>
        <input type="text" v-model="shareUrl" id="shareUrl" placeholder="Enter your URL" />
        <textarea v-model="shareText" id="shareText" placeholder="Enter your text here"></textarea>
        <input type="text" v-model="shareHashtag" id="shareHashtag" placeholder="Enter one or more hashtags" />
        <input type="file" @change="handleFileUpload" id="shareFile" />
        <button class="share-button linkedin-button" @click="shareOnLinkedIn">Share on LinkedIn</button>
      </div>

      <div class="container">
        <button class="share-button back"><router-link to="/" class="router-link">Back</router-link></button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "LinkedInPage",
    data() {
        return {
        clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID,
        clientSecret: import.meta.env.VITE_LINKEDIN_CLIENT_SECRET,
        redirectUri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI,
        scope: "openid profile w_member_social",
        shareUrl: "",
        shareText: "",
        shareHashtag: "",
        shareFile: null,
        statusMessage: "",
        accessToken: localStorage.getItem("linkedinAccessToken") || null,
        personId: localStorage.getItem("linkedinPersonId") || null,
        };
    },
    mounted() {
        this.checkAuthCode();
    },
    watch: {
    shareUrl(newValue) {
        console.log("shareUrl :", newValue);
    }
    },
    methods: {
        async checkAuthCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get("code");
        console.log('authCode : ', authCode);

        if (authCode) {
            try {
            const accessToken = await this.getAccessToken(authCode);
            localStorage.setItem("linkedinAccessToken", accessToken);
            this.accessToken = accessToken;
            console.log('accessToken : ', accessToken);
            await this.checkLinkedInConnection();
            } catch (error) {
            console.error("Erreur lors de la récupération de l'access token:", error);
            }
        } else {
            await this.checkLinkedInConnection();
        }
        },
        async checkLinkedInConnection() {
        if (this.accessToken) {
            console.log("Utilisateur déjà connecté !");
            if (!this.personId) {
            console.log("ID de la personne non trouvé, récupération...");
            try {
                const person = await this.getPersonId(this.accessToken);
                this.personId = person.sub;
                localStorage.setItem("linkedinPersonId", this.personId);
                console.log("ID de la personne :", this.personId);
            } catch (error) {
                console.error("Erreur lors de la récupération des informations utilisateur:", error);
            }
            }
        } else {
            console.log("Utilisateur non connecté, redirection...");
            this.connectLinkedIn();
        }
        },
        connectLinkedIn() {
        const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${this.clientId}&redirect_uri=${encodeURIComponent(this.redirectUri)}&scope=${this.scope}`;
        window.location.href = authUrl;
        },
        async getAccessToken(authCode) {
        const response = await fetch("https://share-api-beryl.vercel.app/api/getLinkedInToken", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
            grant_type: "authorization_code",
            code: authCode,
            redirect_uri: this.redirectUri,
            client_id: this.clientId,
            client_secret: this.clientSecret,
            }),
        });

        const data = await response.json();
        console.log("Response data:", data);

        if (data.access_token) {
            return data.access_token;
        } else {
            throw new Error("Impossible de récupérer l'access token");
        }
        },
        async getPersonId(accessToken) {
        const response = await fetch("https://share-api-beryl.vercel.app/api/getLinkedInUserId", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken }),
        });

        const data = await response.json();
        if (data.sub) {
            return data;
        } else {
            throw new Error("Impossible de récupérer l'ID utilisateur");
        }
        },
        async shareOnLinkedIn() {
        const hashtags = this.formatHashtags(this.shareHashtag);
        const fullText = `${this.shareText} ${hashtags}`;

        this.statusMessage = "Partage en cours...";
        try {
            const imageAsset = this.shareFile ? await this.uploadImage(this.accessToken, this.shareFile, this.personId) : null;

            const response = await fetch("https://share-api-beryl.vercel.app/api/shareOnLinkedIn", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullText,
                shareUrl: this.shareUrl,
                accessToken: this.accessToken,
                personId: this.personId,
                imageAsset,
            }),
            });

            const data = await response.json();
            if (data.error) {
            throw new Error(data.error);
            }
            this.statusMessage = "Partage réussi !";
        } catch (error) {
            this.statusMessage = `Erreur: ${error.message}`;
            console.error("Erreur lors du partage:", error);
        }
        },
        async uploadImage(accessToken, file, personId) {
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = async () => {
            const base64File = reader.result.split(",")[1];
            try {
                const response = await fetch("https://share-api-beryl.vercel.app/api/registerUpload", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken, shareFile: base64File, personId, fileType: file.type }),
                });

                if (!response.ok) {
                const errorData = await response.json();
                reject(new Error(`Erreur lors de l'upload: ${JSON.stringify(errorData)}`));
                }

                const { assetId } = await response.json();
                resolve(assetId);
            } catch (error) {
                reject(error);
            }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
        },
        formatHashtags(hashtags) {
        return hashtags
            .split(" ")
            .map((word) => (word[0] !== "#" ? `#${word}` : word))
            .join(" ");
        },
        handleFileUpload(event) {
        this.shareFile = event.target.files[0];
        },
    },
  };
  </script>
  
<template>
  <iframe v-if="iframeEnabled"/>
  <div v-else class="cookieControl__BlockedIframe">
    <p>
      {{ cookies.text.blockedIframe }}
      <a href="#" @click.prevent="cookies.modal = true" v-text="cookies.text.here"/>
    </p>
  </div>
</template>

<script>
let loaded = false;
export default {
  name: 'CookieIframe',
  data(){
    return{
      cookies: this.$cookies,
      loaded: false,
    }
  },

  computed: {
    iframeEnabled(){
      return this.cookies.enabled.filter(c =>{return c.name === 'functional'}).length > 0
    }
  }
}
</script>

<style lang="scss">
.cookieControl__BlockedIframe{
  padding: 20px;
  border: 2px solid #ddd;
  p, a{
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }
}
</style>

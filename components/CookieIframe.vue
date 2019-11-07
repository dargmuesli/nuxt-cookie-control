<template>
  <iframe v-if="iframeEnabled"/>
  <div v-else :class="['cookieControl__BlockedIframe', {'cookieControl__Holder': cookies.css === true}]">
    <p>
      {{ iframeText }}
      <a href="#" @click.prevent="cookies.modal = true" v-text="cookies.text.here" v-if="cookies && cookies.text"/>
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
    },

    iframeText(){
      return this.cookies && this.cookies.text ? this.cookies.text.blockedIframe : '';
    }
  }
}
</script>

<style lang="scss" scoped>
.cookieControl__BlockedIframe{
  padding: 20px;
  border: 2px solid #ddd;
  p, a{
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  }
}
</style>
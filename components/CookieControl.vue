<template>
  <section class="cookieControl" v-if="cookies.text">
    <transition :name="`cookieControl__Bar--${cookies.barPosition}`">
    <div :class="`cookieControl__Bar cookieControl__Bar--${cookies.barPosition}`" v-if="colorsSet && !cookies.consent">
      <div class="cookieControl__BarContainer">
        <div>
          <slot name="bar">
            <h3 v-text="cookies.text.barTitle"/>
            <p v-text="cookies.text.barDescription"/>
          </slot>
        </div>
        <div class="cookieControl__BarButtons">
          <button @click="cookies.modal = true" v-text="cookies.text.manageCookies"/>
          <button @click="setConsent" v-text="cookies.text.acceptAll"/>
        </div>
      </div>
    </div>
    </transition>
    <transition name="cookieControl__Modal">
      <div class="cookieControl__Modal" v-if="cookies.modal">
        <p v-if="!saved" class="cookieControl__ModalUnsaved" v-text="cookies.text.unsaved"/>
        <div class="cookieControl__ModalContent">
          <div>
            <slot name="modal"/>
            <button @click="cookies.modal = false" class="cookieControl__ModalClose" v-text="cookies.text.close"/>
            <template v-for="type in ['necessary', 'optional']">
              <h3 v-text="cookies.text[type]" :key="type.id"/>
              <ul :key="type.id">
                <li v-for="cookie in cookies[type]" :key="cookie.id">
                  <div class="cookieControl__ModalInputWrapper">
                    <input v-if="type === 'necessary' && cookie.name !== 'functional'" :id="cookie.name" type="checkbox" disabled checked/>
                    <input v-else :id="cookie.name" type="checkbox" :checked="cookies.enabledList.includes(cookies.slugify(cookie.name)) || (cookies.get('cookie_control_consent').length === 0 && cookie.initialState === true)" @change="toogleCookie(cookies.slugify(cookie.name))"/>
                    <label :for="cookie.name" v-text="getName(cookie.name)"/>
                    <span class="cookieControl__ModalCookieName">
                      {{ getName(cookie.name) }}
                      <span v-if="cookie.description" v-text="getDescription(cookie.description)"/>
                    </span>
                  </div>
                  <ul v-if="cookie.cookies">
                    <li v-for="item in cookie.cookies" :key="item.id" v-text="item"/>
                  </ul>
                </li>
              </ul>
            </template>
            <div class="cookieControl__ModalButtons">
              <button @click="setConsent({type: 'partial'})" v-text="cookies.text.save"/>
              <button @click="setConsent" v-if="cookies.enabledList.length < optionalCookies.length" v-text="cookies.text.acceptAll"/>
              <button @click="setConsent({consent: false})" v-if="cookies.enabledList.length >= optionalCookies.length" v-text="cookies.text.declineAll"/>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
import cssVars from 'css-vars-ponyfill';
export default {
  name: 'CookieControl',
  props: {
    locale: {
      default: 'en'
    }
  },
  data(){
    return{
      saved: true,
      colorsSet: false,
      cookies: this.$cookies,
    }
  },

  computed: {
    expirationDate(){
      let date = new Date();
      date.setFullYear(date.getFullYear()+1);
      return date.toUTCString();
    },

    optionalCookies(){
      return this.cookies.optional;
    }
  },

  methods: {
    toogleCookie(cookie){
      if(this.saved) this.saved = false;
      if(!this.cookies.enabledList.includes(cookie)) this.cookies.enabledList.push(cookie);
      else this.cookies.enabledList.splice(this.cookies.enabledList.indexOf(cookie), 1);
    },

    setConsent({type, consent=true}){
      this.cookies.set({name: 'cookie_control_consent', value: consent, expires: this.expirationDate});
      let enabledCookies = type === 'partial' && consent ? this.cookies.enabledList : [...this.optionalCookies.map(c =>{return this.cookies.slugify(c.name)})];
      this.cookies.set({name: 'cookie_control_enabled_cookies', value: consent ? enabledCookies.join(',') : '', expires: this.expirationDate});
      if(process.browser) window.location.reload(true);
    },

    getDescription(description){
      if(typeof(description) === 'string') return ` ${this.cookies.dashInDescription !== false ? '-' : ''} ${description}`;
      else if(description[this.locale]) return ` ${this.cookies.dashInDescription !== false ? '-' : ''} ${description[this.locale]}`;
      return '';
    },

    getName(name){
      return name === 'functional' ? this.cookies.text['functional'] : name;
    },

    async setTexts(isChanged=false){
      let text = null;
      try {
        const module = require(`../locale/${this.locale}`);
        text = module.default;
      } catch (e) {
        console.error(`There are no texts for your locale: ${this.locale}`)
      }
      if(this.cookies.text && Object.keys(this.cookies.text).length > 0){
        if(this.cookies.text.locale){
          Object.assign(text, this.cookies.text.locale[this.locale])
          console.log(text)
        }
        if(!isChanged) Object.assign(text, this.cookies.text)
      }
      this.$set(this.$cookies, 'text', text);
    }
  },

  async beforeMount (){
    await this.setTexts();
    if(process.browser && this.cookies.colors){
      let key = null;
      let variables = {};
      for(key in this.cookies.colors){
        let k = key.toLowerCase().includes('unactive') ? key.replace(/Unactive/g, 'Inactive') : key;
        variables[`cookie-control-${k}`] = `${this.cookies.colors[key]}`
      }
      cssVars({variables})
    }
    if(this.cookies.get('cookie_control_consent').length === 0){
      this.optionalCookies.forEach(c =>{
        if(c.initialState === true) this.cookies.enabledList.push(this.cookies.slugify(c.name))
      })
    }
    this.colorsSet = true;
  },

  watch: {
    async locale(){
      await this.setTexts(true);
    }
  }
}
</script>
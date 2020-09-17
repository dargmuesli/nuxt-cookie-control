<template>
  <client-only>
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
      <button class="cookieControl__ControlButton" aria-label="Cookie control" v-if="cookies.controlButton && colorsSet && cookies.consent" @click="cookies.modal = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13 35.22a132.221 132.221 0 00-57.79 57.81l-35.1 68.88a132.645 132.645 0 00-12.82 80.95l12.08 76.27a132.521 132.521 0 0037.16 72.96l54.77 54.76a132.036 132.036 0 0072.71 37.06l76.71 12.15c27.51 4.36 55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0057.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"/></svg>
      </button>
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
                      <input v-if="type === 'necessary' && cookie.name !== 'functional'" :id="getCookieFirstName(cookie.name)" type="checkbox" disabled checked/>
                      <input v-else :id="getCookieFirstName(cookie.name)" type="checkbox" :checked="cookies.enabledList.includes(cookie.identifier || cookies.slugify(getCookieFirstName(cookie.name))) || (cookies.get('cookie_control_consent').length === 0 && cookie.initialState === true)" @change="toogleCookie(cookie)"/>
                      <label :for="getCookieFirstName(cookie.name)" v-html="getName(cookie.name)"/>
                      <span class="cookieControl__ModalCookieName">
                        {{ getName(cookie.name) }}
                        <span v-if="cookie.description" v-html="getDescription(cookie.description)"/>
                      </span>
                    </div>
                    <template v-if="cookie.cookies">
                      <slot name="cookie" v-bind="{config: cookie}">
                        <ul>
                          <li v-for="item in cookie.cookies" :key="item.id" v-html="item"/>
                        </ul>
                      </slot>
                    </template>
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
  </client-only>
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
      let cookieName = cookie.identifier || this.cookies.slugify(this.getCookieFirstName(cookie.name));
      if(this.saved) this.saved = false;
      if(!this.cookies.enabledList.includes(cookieName)) this.cookies.enabledList.push(cookieName);
      else this.cookies.enabledList.splice(this.cookies.enabledList.indexOf(cookieName), 1);
    },

    setConsent({type, consent=true}){
      this.cookies.set({name: 'cookie_control_consent', value: consent, expires: this.expirationDate});
      let enabledCookies = type === 'partial' && consent ? this.cookies.enabledList : [...this.optionalCookies.map(c =>{
        return c.identifier || this.cookies.slugify(this.getCookieFirstName(c.name))
      })];
      this.cookies.set({name: 'cookie_control_enabled_cookies', value: consent ? enabledCookies.join(',') : '', expires: this.expirationDate});
      if(process.browser) window.location.reload(true);
    },

    getDescription(description){
      if(typeof(description) === 'string') return ` ${this.cookies.dashInDescription !== false ? '-' : ''} ${description}`;
      else if(description[this.locale]) return ` ${this.cookies.dashInDescription !== false ? '-' : ''} ${description[this.locale]}`;
      return '';
    },

    getName(name){
      return name === 'functional' ? this.cookies.text['functional'] : typeof(name) === 'string' ? name : name[this.locale] ? name[this.locale] : name[Object.keys(name)[0]];
    },

    getCookieFirstName(name){
      return typeof(name) === 'string' ? name : name[Object.keys(name)[0]]
    },

    async setTexts(isChanged=false){
      let text = null;
      try {
        const module = require(`../locale/${this.locale}`);
        text = module.default;
      } catch (e) {
        const module = require(`../locale/en`);
        text = module.default;
        console.error(`There are no texts for your locale: ${this.locale}. Using English version`);
      }
      if(this.cookies.text && Object.keys(this.cookies.text).length > 0){
        if(this.cookies.text.locale){
          Object.assign(text, this.cookies.text.locale[this.locale])
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
    if(this.cookies.get('cookie_control_consent') && this.cookies.get('cookie_control_consent').length === 0){
      this.optionalCookies.forEach(c =>{
        if(c.initialState === true) {
          this.cookies.enabledList.push(c.identifier || this.cookies.slugify(this.getCookieFirstName(c.name)));
        }
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
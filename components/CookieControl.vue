<template>
  <section class="cookieControl">
    <transition name="cookieControl__Bar">
    <div class="cookieControl__Bar" v-if="colorsSet && !cookies.consent">
      <div>
        <slot>
          <h3 v-text="cookies.text.barTitle"/>
          <p v-text="cookies.text.barDescription"/>
        </slot>
      </div>
      <div class="cookieControl__BarButtons">
        <button @click="cookies.modal = true" v-text="cookies.text.controlCookies"/>
        <button @click="setConsent" v-text="cookies.text.acceptAll"/>
      </div>
    </div>
    </transition>
    <transition name="cookieControl__Modal">
      <div class="cookieControl__Modal" v-if="cookies.modal">
        <p v-if="!saved" class="cookieControl__ModalUnsaved" v-text="cookies.text.unsaved"/>
        <div class="cookieControl__ModalContent">
          <button @click="cookies.modal = false" class="cookieControl__ModalClose" v-text="cookies.text.close"/>
          <template v-for="type in ['necessary', 'optional']">
            <h3 v-text="cookies.text[type]" :key="type.id"/>
            <ul :key="type.id">
              <li v-for="cookie in cookies[type]" :key="cookie.id">
                <div class="cookieControl__ModalInputWrapper">
                  <input v-if="type === 'necessary'" :id="cookie.name" type="checkbox" disabled checked/>
                  <input v-else :id="cookie.name" type="checkbox" :checked="cookies.enabledList.includes(cookie.name)" @input="toogleCookie(cookie.name)"/>
                  <label :for="cookie.name" v-text="cookie.name"/>
                  <span class="cookieControl__ModalCookieName">
                    {{ cookie.name }}
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
    </transition>
  </section>
</template>

<script>
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
      let enabledCookies = type === 'partial' && consent ? this.cookies.enabledList : [...this.optionalCookies.map(c =>{return c.name})];
      this.cookies.set({name: 'cookie_control_enabled_cookies', value: consent ? enabledCookies.join(',') : '', expires: this.expirationDate});
      if(process.browser) window.location.reload(true);
    },

    getDescription(description){
      if(typeof(description) === 'string') return ` - ${description}`;
      else if(description[this.locale]) return ` - ${description[this.locale]}`;
      return '';
    },

    async setTexts(isChanged){
      let text = null;
      try {
        const module = await import(`../locale/${this.locale}`);
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

  async mounted(){
    await this.setTexts();
    if(process.browser && this.cookies.colors){
      let key = null;
      for(key in this.cookies.colors){
        document.documentElement.style.setProperty(`--cookie-control-${key}`, `${this.cookies.colors[key]}`);
      }
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

<style lang="scss">
  html:root{
    --cookie-control-barTextColor: #fff;
    --cookie-control-modalOverlay: #000;
    --cookie-control-barBackground: #000;
    --cookie-control-barButtonColor: #000;
    --cookie-control-modalTextColor: #000;
    --cookie-control-modalBackground: #fff;
    --cookie-control-modalOverlayOpacity: 0.8;
    --cookie-control-modalButtonColor: #fff;
    --cookie-control-modalUnsavedColor: #fff;
    --cookie-control-barButtonHoverColor: #fff;
    --cookie-control-barButtonBackground: #fff;
    --cookie-control-modalButtonHoverColor: #fff;
    --cookie-control-modalButtonBackground: #000;
    --cookie-control-barButtonHoverBackground: #333;
    --cookie-control-checkboxActiveBackground: #000;
    --cookie-control-checkboxUnactiveBackground: #000;
    --cookie-control-modalButtonHoverBackground: #333;
    --cookie-control-checkboxDisabledBackground: #ddd;
    --cookie-control-checkboxActiveCircleBackground: #fff;
    --cookie-control-checkboxUnactiveCircleBackground: #fff;
    --cookie-control-checkboxDisabledCircleBackground: #fff;
  }

  //Transitions
  .cookieControl__Modal-enter-active, .cookieControl__Modal-leave-active {
    transition: opacity .25s;
  }

  .cookieControl__Modal-enter, .cookieControl__Modal-leave-to {
    opacity: 0;
  }

  .cookieControl__Bar-enter-active, .cookieControl__Bar-leave-active {
    transition: transform .25s;
  }

  .cookieControl__Bar-enter, .cookieControl__Bar-leave-to {
    transform: translateY(100%);
  }

  .cookieControl{
    position: relative;
    z-index: 100000;
    button{
      border: 0;
      outline: 0;
      font-size: 16px;
      cursor: pointer;
      padding: 12px 20px;
      backface-visibility: hidden;
      transition: background-color 200ms, color 200ms;
    }
  }

  .cookieControl__Bar{
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    padding: 20px;
    align-items: flex-end;
    justify-content: space-between;
    background-color: var(--cookie-control-barBackground);
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;

    h3, p{
      color: var(--cookie-control-barTextColor);
      max-width: 900px;
    }

    h3{
      margin: 0;
      font-size: 20px;
    }

    p{
      font-size: 16px;
      margin: 5px 0 0;
    }

    button{
      color: var(--cookie-control-barButtonColor);
      background-color: var(--cookie-control-barButtonBackground);
      &:hover{
        color: var(--cookie-control-barButtonHoverColor);
        background-color: var(--cookie-control-barButtonHoverBackground)
      }
      & + button{
        margin-left: 10px;
      }
    }
  }

  .cookieControl__BarButtons{
    display: flex;
  }

  .cookieControl__Modal{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    font-size: 0;
    text-align: center;
    &:before{
      content: "";
      min-height: 100vh;
      display: inline-block;
      vertical-align: middle;
    }

    &:after{
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      opacity: var(--cookie-control-modalOverlayOpacity);
      background-color: var(--cookie-control-modalOverlay);
    }

    button{
      color: var(--cookie-control-modalButtonColor);
      background-color: var(--cookie-control-modalButtonBackground);
      &:hover{
        color: var(--cookie-control-modalButtonHoverColor);
        background-color: var(--cookie-control-modalButtonHoverBackground)
      }
    }
  }

  .cookieControl__ModalContent{
    position: relative;
    width: 100%;
    padding: 40px;
    max-width: 550px;
    max-height: 80vh;
    text-align: left;
    overflow-y: scroll;
    display: inline-block;
    vertical-align: middle;
    background-color: var(--cookie-control-modalBackground);
    *{
      &:not(button){
        color: var(--cookie-control-modalText);
      }
    }

    h3{
      font-size: 24px;
      margin: 50px 0 25px;
      &:first-of-type{
        margin-top: 0;
      }
    }

    ul{
      padding: 0;
      font-size: 16px;
      list-style-type: none;
      ul{
        padding: 5px 56px 0;
        li{
          & + li{
            margin-top: 5px;
          }
        }
      }
    }

    li{
      align-items: center;
      & + li{
        margin-top: 20px;
      }
    }

    input{
      display: none;
      &:checked{
        & + label{
          background-color: var(--cookie-control-checkboxActiveBackground);
          &:before{
          background-color: var(--cookie-control-checkboxActiveCircleBackground);
            transform: translate3d(100%, -50%, 0);
          }
        }

        &:disabled{
          & + label{
            background-color: var(--cookie-control-checkboxDisabledBackground);
            &:before{
              background-color: var(--cookie-control-checkboxDisabledCircleBackground)
            }
          }
        }
      }
    }

    label{
      position: relative;
      min-width: 36px;
      min-height: 20px;
      font-size: 0;
      display: block;
      margin-right: 20px;
      border-radius: 20px;
      backface-visibility: hidden;
      transition: background-color 200ms;
      background-color: var(--cookie-control-checkboxUnactiveBackground);
      &:before{
        position: absolute;
        content: "";
        top: 50%;
        left: 3px;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        transition: transform 200ms;
        transform: translate3d(0, -50%, 0);
        background-color: var(--cookie-control-checkboxUnactiveCircleBackground);
      }
    }
  }

  .cookieControl__ModalInputWrapper{
    display: flex;
    align-items: flex-start;
  }

  .cookieControl__ModalCookieName{
    font-weight: bold;
    text-transform: uppercase;
    span{
      font-weight: normal;
      text-transform: none;
    }
  }

  .cookieControl__ModalClose{
    position: absolute;
    top: 40px;
    right: 40px;
  }

  .cookieControl__ModalButtons{
    display: flex;
    margin-top: 80px;
    align-items: flex-start;
    button{
      & + button{
        margin-left: 20px;
      }
    }
  }

  .cookieControl__ModalUnsaved{
    position: absolute;
    left: 50%;
    bottom: 40px;
    margin: 0;
    color: var(--cookie-control-modalUnsavedColor);
    font-size: 14px;
    transform: translateX(-50%);
  }

  @media screen and (max-width: 768px){
    .cookieControl__Bar{
      flex-direction: column;
    }

    .cookieControl__ModalContent{
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      max-height: 100%;
      padding-top: 100px;
    }

    .cookieControl__BarButtons{
      margin-top: 30px;
    }
  }
</style>

import Vue from 'vue';
import CookieControl from <%= serialize(options.component) %>;
import CookieIframe from <%= serialize(options.iframe) %>;
let ua = window.navigator.userAgent;
const isIE = ua.indexOf('MSIE ') > 0 || ua.indexOf('Edge/') > 0 || ua.indexOf('Trident/') > 0;
export default(context, inject) =>{
  let cookies = {
    modal: false,
    consent: false,
    scripts: [],
    enabled: [],
    enabledList: [],
    optional: []
  }

  Object.assign(cookies, <%= serialize(options) %>);
  cookies.colors = {
    barTextColor: '#fff',
    modalOverlay: '#000',
    barBackground: '#000',
    barButtonColor: '#000',
    modalTextColor: '#000',
    modalBackground: '#fff',
    modalOverlayOpacity: 0.8,
    modalButtonColor: '#fff',
    modalUnsavedColor: '#fff',
    barButtonHoverColor: '#fff',
    barButtonBackground: '#fff',
    modalButtonHoverColor: '#fff',
    modalButtonBackground: '#000',
    barButtonHoverBackground: '#333',
    checkboxActiveBackground: '#000',
    checkboxInactiveBackground: '#000',
    modalButtonHoverBackground: '#333',
    checkboxDisabledBackground: '#ddd',
    checkboxActiveCircleBackground: '#fff',
    checkboxInactiveCircleBackground: '#fff',
    checkboxDisabledCircleBackground: '#fff',
  };
  Object.assign(cookies.colors, <%= serialize(options.colors) %>);

  let methods = {
    get: (cookie) => {
      if(process.browser){
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        let name = `${cookie}=`;
        for(let i = 0; i <ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
      }
      return '';
    },

    set: ({name, value='', expires='', path='/', domain}) => {
      if(process.browser){
        document.cookie = `${name}=${value};expires=${expires};path=${path}${domain !== undefined ? `;domain=${domain}` : ';'}`;
      } else if(process.server){
        context.res.setHeader('Set-Cookie', [`${name}=${value}; Expires=${expires}; Path=${path}${domain !== undefined ? `; Domain=${domain}` : ';'}`]);
      }
    },

    setBlockedIframes: (content) =>{
      let type = (typeof(content)).toLowerCase();
      let c = type !== 'string' ? JSON.stringify(content) : content;
      c = c.replace(/&lt;/g, '<');
      c = c.replace(/&gt;/g, '>');
      if(context.app.$cookies.enabled.filter(c =>{return c.name === 'functional'}).length === 0){
        c = c.replace(/<iframe/g, `<div class='cookieControl__BlockedIframe '`);
        c = c.replace(/<\/iframe/g, `<p>${context.app.$cookies.text.blockedIframe !== undefined ? context.app.$cookies.text.blockedIframe : ''} <a href='#' onclick='event.preventDefault(); $nuxt.$cookies.modal = true'>${context.app.$cookies.text.here !== undefined ? context.app.$cookies.text.here: ''}</a></p></div`); 
      }
      return type !== 'string' ? JSON.parse(c) : c
    }
  }

  Object.assign(cookies, methods);

  const clearCookies = () =>{
    let disabled = cookies.optional.filter(c => {return !cookies.enabled.includes(c.name)});
    if(disabled.length > 0){
      disabled.forEach(c => {
        if(c.declined) c.declined();
        if(c.cookies && c.cookies.length > 0){
          let domain = window.location.hostname;
          c.cookies.forEach(i => {
            cookies.set({name: i, expires: 'Thu, 01 Jan 1970 00:00:00 GMT', domain });
            for (let j = domain.split('.'); j.length;) {
              let o = j.join('.');
              cookies.set({name: i, expires: 'Thu, 01 Jan 1970 00:00:00 GMT', domain: `.${o}` });
              j.shift();
            }
          })
        }
      })
    }
  }

  const setHead = () =>{
    if(cookies.enabled.length > 0){
      let head = document.getElementsByTagName('head')[0];
      cookies.enabled.forEach(c =>{
        if(c.src){
          let script = document.createElement('script');
          script.src = c.src;
          head.appendChild(script);
        }

        if(c.accepted) c.accepted();
      })
    }
  }

  cookies.consent = cookies.get('cookie_control_consent') === 'true' ? true : false;

  if(cookies.consent === true){
    let enabledFromCookie = cookies.get('cookie_control_enabled_cookies');
    cookies.enabled.push(...cookies.optional.filter(c => {return enabledFromCookie.includes(c.name)}));
    cookies.enabledList = cookies.enabled.length > 0 ? cookies.enabled.map(c => {return c.name}) : [];
  }

  cookies.enabled.push(...cookies.necessary.filter(c => {return c.src}))

  if(process.browser){
    setHead();
    clearCookies();
  }
  inject('cookies', cookies);
  if(cookies.blockIframe) Vue.component('CookieIframe', CookieIframe);
  Vue.component('CookieControl', CookieControl);
}
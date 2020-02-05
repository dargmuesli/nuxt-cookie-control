import Vue from 'vue';
import CookieControl from <%= serialize(options.component) %>;
import CookieIframe from <%= serialize(options.iframe) %>;
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
    controlButtonIconColor: '#000',
    modalButtonBackground: '#000',
    controlButtonBackground: '#fff',
    barButtonHoverBackground: '#333',
    checkboxActiveBackground: '#000',
    controlButtonIconHoverColor: '#fff',
    checkboxInactiveBackground: '#000',
    modalButtonHoverBackground: '#333',
    checkboxDisabledBackground: '#ddd',
    controlButtonHoverBackground: '#000',
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
      let domainName = domain ? domain : cookies.domain ? `.${cookies.domain}` : domain;
      if(process.browser){
        document.cookie = `${name}=${value};expires=${expires};path=${path}${domainName !== undefined ? `;domain=${domainName}` : ';'}`;
      } else if(process.server){
        context.res.setHeader('Set-Cookie', [`${name}=${value}; Expires=${expires}; Path=${path}${domainName !== undefined ? `; Domain=${domainName}` : ';'}`]);
      }
    },
    
    setBlockedIframes: (content) =>{
      let type = (typeof(content)).toLowerCase();
      let c = type !== 'string' ? JSON.stringify(content) : content;
      c = c.replace(/&lt;/g, '<');
      c = c.replace(/&gt;/g, '>');
      if(context.app.$cookies.enabled.filter(c =>{return c.name === 'functional'}).length === 0){
        c = c.replace(/<iframe/g, `<div class='cookieControl__BlockedIframe '`);
        c = c.replace(/<\/iframe/g, `<p>${context.app.$cookies.text.blockedIframe !== undefined ? context.app.$cookies.text.blockedIframe : ''} <a href='#' onclick='event.preventDefault(); $${cookies.globalName}.$cookies.modal = true'>${context.app.$cookies.text.here !== undefined ? context.app.$cookies.text.here: ''}</a></p></div`); 
      }
      return type !== 'string' ? JSON.parse(c) : c
    },
    
    slugify: (str) =>{
      str = str.replace(/^\s+|\s+$/g, '');
      str = str.toLowerCase();
      let from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
      let to   = "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
      for (let i = 0, l = from.length; i < l ; i++){
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
      }
      
      str = str.replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-'); 
    
      return str;
    },

    remove: (name) =>{
      if(process.browser){
        let domain = window.location.hostname;
        cookies.set({name, expires: 'Thu, 01 Jan 1970 00:00:00 GMT', domain });
        for (let j = domain.split('.'); j.length;) {
          let o = j.join('.');
          cookies.set({name, expires: 'Thu, 01 Jan 1970 00:00:00 GMT', domain: `.${o}` });
          j.shift();
        }
      }
    }
  }
  
  Object.assign(cookies, methods);
  
  const clearCookies = () =>{
    let disabled = cookies.optional.filter(c => {
      let cookieName = typeof(c.name) === 'string' ? c.name : c.name[Object.keys(c.name)[0]]
      return !cookies.enabledList.includes(cookies.slugify(cookieName))
    });
    if(disabled.length > 0){
      disabled.forEach(c => {
        if(c.declined) c.declined();
        if(c.cookies && c.cookies.length > 0){
          c.cookies.forEach(i => {
            cookies.remove(i);
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
          script.addEventListener('load', () =>{
            if(c.accepted) c.accepted();
          })
        }
      })
    }
  }
  
  const callAcceptedFunctions = () =>{
    if(cookies.enabled.length > 0){
      cookies.enabled.forEach(c =>{
        if(c.accepted && !c.src) c.accepted();
      })
    }
  }

  const capitalize = (s) =>{
    if(typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
  
  cookies.consent = cookies.get('cookie_control_consent') === 'true' ? true : false;
  
  if(cookies.consent === true){
    let enabledFromCookie = cookies.get('cookie_control_enabled_cookies');
    cookies.enabled.push(...cookies.optional.filter(c => {
      let cookieName = typeof(c.name) === 'string' ? c.name : c.name[Object.keys(c.name)[0]]
      return enabledFromCookie.includes(cookies.slugify(cookieName))
    }));
    cookies.enabledList = cookies.enabled.length > 0 ? cookies.enabled.map(c => {
      let cookieName = typeof(c.name) === 'string' ? c.name : c.name[Object.keys(c.name)[0]]
      return cookies.slugify(cookieName)
    }) : [];
  }
  
  if(cookies.necessary) cookies.enabled.push(...cookies.necessary.filter(c => {return c.src || c.accepted}))
  
  if(process.browser){
    let globalName = capitalize(cookies.globalName) || 'Nuxt';
    window[`on${globalName}Ready`](() => {
      setHead();
      clearCookies();
      callAcceptedFunctions();
    })
  }

  inject('cookies', cookies);
  if(cookies.blockIframe) Vue.component('CookieIframe', CookieIframe);
  Vue.component('CookieControl', CookieControl);
}
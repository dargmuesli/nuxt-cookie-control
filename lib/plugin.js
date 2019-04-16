import Vue from 'vue';
import CookieControl from <%= serialize(options.component) %>;
export default(context, inject) =>{
  let {res, ssrContext} = context;
  let cookies = {
    modal: false,
    consent: false,
    scripts: [],
    enabled: [],
    enabledList: [],

    get: (cookie) => {
      let cookies = process.browser ? document.cookie : process.server ? ssrContext.req.headers.cookie : undefined;
      if(cookies){
        let decodedCookie = decodeURIComponent(cookies);
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
        res.setHeader('Set-Cookie', [`${name}=${value}; Expires=${expires}; Path=${path}${domain !== undefined ? `; Domain=${domain}` : ';'}`]);
      }
    },
  }

  Object.assign(cookies, <%= serialize(options) %>);

  const callAcceptedFunction = () =>{
    cookies.enabled.forEach(c =>{
      if(c.accepted) c.accepted();
    })
  }

  const clearCookies = () =>{
    let disabled = cookies.optional.filter(c => {return !cookies.enabled.includes(c.name)});
    if(disabled.length > 0){
      disabled.forEach(c => {
        if(c.declined) c.declined();
        if(c.cookies.length > 0){
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
        let script = document.createElement('script');
        script.src = c.src;
        head.appendChild(script);
      })
    }
  }

  cookies.consent = cookies.get('cookie_control_consent') === 'true' ? true : false;

  if(cookies.consent === true){
    let enabledFromCookie = cookies.get('cookie_control_enabled_cookies');
    cookies.enabled.push(...cookies.optional.filter(c => {return enabledFromCookie.includes(c.name) && c.src}))
    cookies.enabledList = cookies.enabled.length > 0 ? cookies.enabled.map(c => {return c.name}) : [];
  }

  cookies.enabled.push(...cookies.necessary.filter(c => {return c.src}))

  if(process.browser){
    setHead();
    clearCookies();
    callAcceptedFunction();
  }
  inject('cookies', cookies)
  Vue.component('CookieControl', CookieControl);
}
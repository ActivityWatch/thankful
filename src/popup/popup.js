import {
  Vuetify, // required
  VApp, // required
  VBtn,
} from 'vuetify';

(async () => {
  const Vue = (await import('vue')).default;
  const App = (await import('./popup.vue')).default;

  Vue.use(Vuetify, {
    components: {
      VApp,
      VBtn,
    },
  });

  new Vue({
    el: '#popup',
    render: h => h(App),
  });
})();

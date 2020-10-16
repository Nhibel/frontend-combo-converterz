export default {
    state: {
        
    },
    
    mutations: {
        
    },
    actions: {
        getYoutubeId({ commit }, youtubeLink) {
            console.log('dans le store');
            var regex = /(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-\_]{11})[a-z0-9;:@#?&%=+\/\$_.-]*/;
            var match = youtubeLink.match(regex);
            return match && match[1].length == 11 ? match[1] : false;
          },

        makeToast({commit}, {vm, variant, message, position}) {
          if (position == '' || position == undefined) {
            position = 'b-toaster-bottom-full'
          }
        vm.$bvToast.toast(message, {
          title: 'Information',
          variant: variant,
          solid: false,
          autoHideDelay: 3000,
          toaster: position
        })
      }
    }
};
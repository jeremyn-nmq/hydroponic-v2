<template>
  <router-view/>
</template>

<script>
export default {
  name: 'App',
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
  },
  methods: {
    logout: function () {
      this.$store.dispatch('logout')
          .then(() => {
            this.$router.push('/login')
          })
    }
  },
  created: function () {
    this.$http.interceptors.response.use(undefined, function (err) {
      return new Promise(function () {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          this.logout()
        }
        throw err;
      });
    });
  }
}
</script>

<style lang="scss">
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>

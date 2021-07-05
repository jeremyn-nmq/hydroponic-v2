<template>
  <router-view/>
</template>

<script>
import fb from "./firebase";
import {FirebaseData} from "@/model/FirebaseData";
import {Account} from "@/model/Account";
import {Sensor} from "@/model/Sensor";

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
    let fbData = fb.database().ref();
    fbData.get().then((snapshot) => {
      if (snapshot.exists()) {
        const fbInitData = new FirebaseData(snapshot.val());
        this.$store.commit("INIT_FIREBASE", fbInitData);

        //handle accounts
        const fbInitAccounts = fbInitData.accounts;
        let accountDetails = Object.keys(fbInitAccounts).map(key => new Account({...fbInitAccounts[key], key}));
        this.$store.commit("INIT_ACCOUNT", accountDetails);
        localStorage.setItem('user', JSON.stringify(accountDetails))

        //handle sensors
        const fbInitSensors= fbInitData.sensors;
        let sensors = Object.keys(fbInitSensors).map(key => new Sensor({...fbInitSensors[key], key}));
        this.$store.commit("INIT_SENSOR", sensors);
        localStorage.setItem('sensor', JSON.stringify(sensors))
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });

    // var starCountRef = fb.database().ref('/Account');
    // starCountRef.on('value', (snapshot) => {
    //   const data = snapshot.val();
    //   console.log(data);
    // });

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

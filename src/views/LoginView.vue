<template>
  <div class="container">
    <div class="about">
      <h1>Login</h1>
      <div class="wrapper">
        <div class="mb-3">
          <label for="location" class="form-label">Email</label>
          <input type="email" class="form-control" v-model="email">
        </div>

        <div class="mb-3">
          <label for="location" class="form-label">Password</label>
          <input type="password" class="form-control" v-model="password">
        </div>
        
        <button type="submit" class="btn btn-primary mt-3" :disabled="loading" v-on:click="login()">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Login</span>
        </button>
      </div>
      <div v-if="loggedIn" class="alert alert-success mt-3">
        Login Successfully
      </div>

      <div class="sign-up mt-3">
        Do not have account? signup <router-link :to="{ name: 'register' }">here</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword, setPersistence, browserSessionPersistence } from 'firebase/auth'; // Import necessary Firebase Authentication functions
import { useLoginStore } from '../stores/login'

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false,
      loggedIn: false
    };
  },
  methods: {
    login() {
      const store = useLoginStore();
      this.loading = true;

      const auth = getAuth();
      
      // Set persistence to LOCAL before attempting to sign in
      setPersistence(auth, browserSessionPersistence)
        .then(() => {
          // Now that persistence is set, proceed with sign in
          signInWithEmailAndPassword(auth, this.email, this.password)
            .then((response) => {
              this.loggedIn = true;
              this.$router.push('/');
              store.logginIn(response);
            })
            .catch((error) => {
              alert(error.message);
            })
            .finally(() => (this.loading = false));
        })
        .catch((error) => {
          alert('Error setting persistence: ' + error.message);
          this.loading = false;
        });
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    position: relative;
    min-height: 90vh;
  }

  .about {
    padding: 2rem;
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .wrapper {
      min-width: 100%;
      display: flex;
      flex-direction: column;
    }

    h1 {
      text-align: center;
    }
  }
</style>

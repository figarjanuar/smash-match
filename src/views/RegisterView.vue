<template>
  <div class="container">
    <div class="about">
      <h1>Register</h1>
      <div class="wrapper">
        <div class="mb-3">
          <label for="location" class="form-label">Name</label>
          <input type="text" class="form-control" v-model="name">
        </div>

        <div class="mb-3">
          <label for="location" class="form-label">Email</label>
          <input type="email" class="form-control" v-model="email">
        </div>

        <div class="mb-3">
          <label for="location" class="form-label">Password</label>
          <input type="password" class="form-control" v-model="pass">
        </div>
        
        <button type="submit" class="btn btn-primary mt-3" :disabled="loading" v-on:click="register()">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Signup</span>
        </button>
      </div>
      <div v-if="matchFound" class="alert alert-success mt-3">
        Login Successfully
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"

export default {
  data() {
    return {
      name:'',
      email: '',
      pass: '',
      loading: false,
      matchFound: false,
    }
  },
  methods: {
    register() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.email, this.pass)
        .then((userCredential) => {
          console.log(userCredential)

          updateProfile(auth.currentUser, {
            displayName: this.name
          })

          this.$router.push({ name: 'profile' })
        })
        .catch((error) => {
          console.log(error)
        })
    },
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

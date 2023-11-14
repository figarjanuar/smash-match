<template>
  <div class="container">
    <div class="about">
      <h1>Find a Match</h1>
      <div class="wrapper">
        <div class="mb-3">
          <label for="location" class="form-label">Pilih Tempat</label>
          <select v-model="selectedVenue" class="form-select" id="location">
            <option value="gor-1">GOR Dramaga</option>
            <option value="gor-2">GOR Sleman</option>
          </select>
        </div>
        
        <button type="submit" class="btn btn-primary mt-3" :disabled="isFindind" v-on:click="findMatch()">
          <span v-if="isFindind" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Find Match</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useLoginStore } from '../stores/login';
import { useMatchStore } from "../stores/match";

export default {
  data() {
    return {
      selectedVenue: 'gor-1',
      matchData: [],
      user: {}
    };
  },
  methods: {
    async findMatch() {
      const matchStore = useMatchStore()
      try {
        matchStore.isFinding(true)
        const loginStore = useLoginStore()

        await this.getUserByUserId(loginStore.userData.user.uid)

        const matchRef = doc(this.$db, "match-queue", this.selectedVenue)
        await setDoc(matchRef, {
          [loginStore.userData.user.uid]: { ...this.user }
        }, { merge: true })

      } catch (e) {
        matchStore.isFinding(false)
        console.error("Error creating or updating document: ", e);
      }
    },
    async getUserByUserId(userId) {
      try {
        const docRef = doc(this.$db, "users", userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          this.user = {
            gender: docSnap.data().gender,
            score: docSnap.data().score,
            name: docSnap.data().displayName,
            photo: docSnap.data().photo,
            phone: docSnap.data().phone,
            venue: this.selectedVenue
          }
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Error getting user document: ", e);
      }
    }
  },
  computed: {
    isFindind() {
      const matchStore = useMatchStore()
      return matchStore.isFindMatch
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
    position: absolute;
    width: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .wrapper {
      margin-top: 2rem;
      min-width: 100%;
      display: flex;
      flex-direction: column;
    }

    h1 {
      text-align: center;
    }
  }
</style>

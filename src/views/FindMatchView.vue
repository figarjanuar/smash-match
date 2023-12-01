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

        <div v-if="showAlert" class="alert alert-warning mt-5">
          Pertandingan belum ditemukan, silahkan cari kembali
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useLoginStore } from '../stores/login';
import { useMatchStore } from "../stores/match";
import axios from "axios";

export default {
  data() {
    return {
      selectedVenue: 'gor-1',
      matchData: [],
      user: {},
      interval: null,
      startTime: null,
      maxTime: 30000,
      showAlert: false
    };
  },
  methods: {
    async findMatch() {
      const matchStore = useMatchStore()
      this.showAlert = false
      try {
        matchStore.isFinding(true)
        const loginStore = useLoginStore()
        console.log(loginStore.userData)
        await this.getUserByUserId(loginStore.userData.user.uid)

        const matchRef = doc(this.$db, "match-queue", loginStore.userData.user.uid)
        await setDoc(matchRef, { ...this.user }, { merge: true })

        let data = JSON.stringify({
          "id": loginStore.userData.user.uid,
          "mmr": Math.round(this.user.score)
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://smapi-qyyf.onrender.com/start',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };

        await axios.request(config)
          .catch(() => {
            matchStore.isFinding(false)
          });

        this.startTime = Date.now()
        this.checkMatchStatus()

      } catch (e) {
        matchStore.isFinding(false)
        console.error("Error creating or updating document: ", e)
      }
    },
    checkMatchStatus() {
      const matchStore = useMatchStore();
      console.log(matchStore.isFindMatch)
      if(matchStore.isFindMatch) {
        const checkStatus = () => {
          axios.post('https://smapi-qyyf.onrender.com/status', {
            id: useLoginStore().userData.user.uid
          })
            .then(async (res) => {
              console.log(res.data.competitor_id !== undefined);
              if(res.data.competitor_id) {
                clearInterval(this.interval)
                matchStore.isFinding(false)
                this.stopFinding(useLoginStore().userData.user.uid)

                const docRef = doc(this.$db, "match-queue", res.data.competitor_id)
                const docSnap = await getDoc(docRef)
                console.log(res.data.competitor_id, docSnap.data(), docSnap.data().competitor_id)

                const matchListDocRef = doc(this.$db, "match-list", useLoginStore().userData.user.uid)
                const matchListSnap = await getDoc(matchListDocRef)
                const matchListData = matchListSnap.exists() ? matchListSnap.data().matches || [] : [];

                matchListData.push({
                  venue: this.selectedVenue,
                  date: new Date(),
                  opponent: docSnap.data(),
                  status: 'berlangsung',
                });

                await setDoc(matchListDocRef, { matches: matchListData })
                await deleteDoc(doc(this.$db, "match-queue", res.data.competitor_id))

                this.$router.push({ name: 'my-match' })
              }

              if(this.startTime == null) {
                this.startTime = Date.now()
              }
            })

          if(Date.now() - this.startTime >= this.maxTime) {
            clearInterval(this.interval)
            matchStore.isFinding(false)
            this.showAlert = true
          }
        }
        
        this.startTime = Date.now()
        this.interval = setInterval(checkStatus, 5000)
        
      } else {
        clearInterval(this.interval)
        matchStore.isFinding(false)
      }
    },
    stopFinding(id) {
      axios.post('https://smapi-qyyf.onrender.com/update', {id: id})
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
          alert("No such document!")
        }
      } catch (e) {
        alert("Error getting user document: "+e)
      }
    }
  },
  computed: {
    isFindind() {
      const matchStore = useMatchStore()
      return matchStore.isFindMatch
    }
  },
  mounted() {
    this.checkMatchStatus()
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

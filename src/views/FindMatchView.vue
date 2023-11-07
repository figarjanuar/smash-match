<template>
  <div class="container">
    <div class="about">
      <h1>Find a Match</h1>
      <div class="wrapper">
        <div class="mb-3">
          <label for="location" class="form-label">Pilih Tempat</label>
          <select v-model="selectedVenue" class="form-select" id="location">
            <option value="gor-1">Gor 1</option>
            <option value="gor3">Gor 1</option>
            <option value="gor3">Gor 1</option>
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
import { doc, runTransaction } from "firebase/firestore";
import { useLoginStore } from '../stores/login';
import { useMatchStore } from "../stores/match";

export default {
  data() {
    return {
      selectedVenue: 'gor-1',
      matchData: []
    };
  },
  methods: {
    async findMatch() {
      try {
        const matchStore = useMatchStore()
        matchStore.isFinding(true)
        const loginStore = useLoginStore()
        const docRef = doc(this.$db, "match-queue", this.selectedVenue)

        // Menggunakan transaksi untuk memastikan operasi aman
        await runTransaction(this.$db, async (transaction) => {
          const docSnap = await transaction.get(docRef);
          const data = docSnap.data() || {};

          // Menambahkan pemain ke dalam antrian atau membuat antrian jika belum ada
          data[loginStore.userData.user.uid] = { score: 100 };
          transaction.set(docRef, data);

          return data;
        });

      } catch (e) {
        this.loading = false
        console.error("Error creating or updating document: ", e);
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

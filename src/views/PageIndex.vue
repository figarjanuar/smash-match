<template>
  <main>
    <div class="bottom-navbar d-flex">
      <router-link :to="{ name: 'my-match' }">
        <icon-list-match />
      </router-link>
      <router-link :to="{ name: 'find-match' }">
        <icon-find-match />
      </router-link>
      <router-link :to="{ name: 'profile' }">
        <icon-profile />
      </router-link>
    </div>

    <div class="container mt-3">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </main>
</template>

<script>
import { doc, onSnapshot, runTransaction } from 'firebase/firestore';
import { useMatchStore } from '../stores/match';
import IconListMatch from '../components/icons/IconListMatch.vue';
import IconFindMatch from '../components/icons/IconFindMatch.vue';
import IconProfile from '../components/icons/IconProfile.vue';

export default {
  components: { IconListMatch, IconFindMatch, IconProfile },
  data() {
    return {
      a: 'a'
    }
  },
  methods: {
    initMatch() {
      const queueDocRef = doc(this.$db, "match-queue", 'gor-1');
      onSnapshot(queueDocRef, async (doc) => {
        const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
        const data = doc.data();

        if (data) {
          // Mengambil pemain yang siap untuk di-cocokkan
          const players = Object.keys(data);

          if (players.length >= 2) {
            // Sort pemain berdasarkan skor
            players.sort((a, b) => data[a].score - data[b].score);

            // Cek apakah selisih skor antara pemain terdekat cukup kecil (<= 5)
            if (data[players[1]].score - data[players[0]].score <= 5) {
              // Pertandingan ditemukan, buat pertandingan 1vs1
              const player1 = players[0];
              const player2 = players[1];

              console.log(`Memulai pertandingan antara ${player1} dan ${player2}`);
              const matchStore = useMatchStore()
              matchStore.isFinding(false)
              // Menggunakan transaksi untuk menghapus pemain dari antrian
              await runTransaction(this.$db, async (transaction) => {
                const docSnap = await transaction.get(queueDocRef);
                const updatedData = docSnap.data();
                delete updatedData[player1];
                delete updatedData[player2];
                transaction.set(queueDocRef, updatedData);
              });
            }
          }
        }
        console.log(source, " data: ", data);
      })
    }
  },
  mounted() {
    this.initMatch()
  },
  beforeMount() {
    console.log('wkwkw');
  }
}
</script>

<style lang="scss" scoped>
.bottom-navbar {
  position: fixed;
  background: var(--primary-color);
  width: 100%;
  left: 0;
  z-index: 100;
  bottom: 0;
  padding: 20px 10px;
  justify-content: space-around;
  box-shadow: 3px 5px 20px 0px rgba(255, 255, 255, 0.3);
  
  div, a {
    color: var(--vt-c-white-soft);
    text-decoration: none;

    svg {
      width: 24px;
      height: 24px;
    }
  }
}

.container {
  margin-bottom: 50px;
}
</style>

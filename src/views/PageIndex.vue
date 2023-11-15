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
import { doc, getDoc, onSnapshot, runTransaction, setDoc } from 'firebase/firestore'
import { useMatchStore } from '../stores/match'
import IconListMatch from '../components/icons/IconListMatch.vue'
import IconFindMatch from '../components/icons/IconFindMatch.vue'
import IconProfile from '../components/icons/IconProfile.vue'
import { useLoginStore } from '../stores/login'

export default {
  components: { IconListMatch, IconFindMatch, IconProfile },
  data() {
    return {
      a: 'a'
    }
  },
  methods: {
    async initMatch() {
      const loginStore = useLoginStore()
      const queueDocRef = doc(this.$db, "match-queue", 'gor-1')
      const matchListDocRef = doc(this.$db, "match-list", loginStore.userData.user.uid)
      const matchStore = useMatchStore()

      // Hanya mendengarkan snapshot jika sedang mencari pertandingan
      onSnapshot(queueDocRef, async (snapshot) => {
        const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server"
        const data = snapshot.data()

        // Hanya melanjutkan jika sedang mencari pertandingan
        if (data) {
          const player1 = data[loginStore.userData.user.uid]
          const players = Object.keys(data).filter(player => player !== loginStore.userData.user.uid)

          for (const player of players) {
            const player2 = data[player]

            const diffScore = Math.abs(player1?.score - player2?.score)

            if (
              diffScore <= 10 &&
              player1.gender === player2.gender &&
              player1.venue === player2.venue
            ) {

              await runTransaction(this.$db, async (transaction) => {
                const docSnap = await transaction.get(queueDocRef);

                // Re-check the data as it might have been modified by other transactions
                const updatedData = docSnap.data();

                if (updatedData) {
                  // Remove players from the queue
                  delete updatedData[loginStore.userData.user.uid];
                  delete updatedData[player];
                  transaction.set(queueDocRef, updatedData);
                }
              })

              const matchListSnap = await getDoc(matchListDocRef)
              const matchListData = matchListSnap.exists() ? matchListSnap.data().matches || [] : []

              // Menyimpan data player2 saja sebagai opponent
              matchListData.push({
                venue: player1.venue,
                date: new Date(),
                opponent: player2,  // Hanya menyimpan data player2
                status: 'berlangsung'
              })

              await setDoc(matchListDocRef, { matches: matchListData })

              matchStore.isFinding(false)
              this.$router.push({ name: 'my-match' })
              return // Hentikan pencarian setelah menemukan lawan
            }
          }
        }
      })
    }

  },
  mounted() {
    this.initMatch()
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

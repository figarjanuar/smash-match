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
import { doc, onSnapshot, runTransaction, setDoc } from 'firebase/firestore'
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
    initMatch() {
      const loginStore = useLoginStore();
      const queueDocRef = doc(this.$db, "match-queue", 'gor-1');

      onSnapshot(queueDocRef, async (snapshot) => {
        const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
        const data = snapshot.data();

        if (data) {
          const players = Object.keys(data);
          const player1 = data[loginStore.userData.user.uid];
          players.splice(players.indexOf(loginStore.userData.user.uid), 1);

          for (const player of players) {
            const diffScore = Math.abs(player1.score - data[player].score);

            if (diffScore <= 2 && player1.gender === data[player].gender) {
              console.log(`Starting match between ${player1} and ${player}`);
              const matchStore = useMatchStore()

              await runTransaction(this.$db, async (transaction) => {
                const docSnap = await transaction.get(queueDocRef, { snapshot: true });
                const updatedData = docSnap.data();

                if (updatedData) {
                  delete updatedData[player1];
                  delete updatedData[player];
                  transaction.set(queueDocRef, updatedData);
                }
              })

              await setDoc(doc(this.$db, "match-list", loginStore.userData.user.uid), {
                venue: player1.venue,
                date: new Date(),
                opponent: data[player],
                status: 0
              })

              matchStore.isFinding(false);
            }
          }
        }
        console.log(source, " data: ", data);
      });
    },
    async sortStringsAsc(a, b) {
      const result = a.localeCompare(b);

      if (result < 0) {
        return [a, b];
      } else if (result > 0) {
        return [b, a];
      } else {
        return [a, b]; // or [b, a], since they are equal
      }
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

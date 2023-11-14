<template>
  <main>
    <div v-if="!detailData" class="wrapper">
      <div class="row mb-5">
        <div class="col-lg-12">
          <div @click="detailData = nextMatch" class="widget-next-match">
            <div class="widget-title mb-3">
              <h3>Next Match</h3>
            </div>
            <div class="widget-body mb-3">
              <div class="widget-vs">
                <div class="d-flex align-items-center justify-content-around justify-content-between w-100">
                  <div class="text-center">
                    <img :src="nextMatch.opponent.photo" alt="Image">
                    <h3 class="mt-3">{{ nextMatch.opponent.name }}</h3>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="text-center widget-vs-contents mb-4">
              <h5>{{ nextMatch.venue }}</h5>
              <p class="mb-5">
                <span class="d-block">{{ nextMatch.date }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="upcoming">
            <h3>Match History</h3>
          </div>
        </div>

        <div v-for="(match, index) in matchHistory" :key="index" class="col-lg-6 mb-4">
          <div class="p-4 rounded list-wrapper">
            <div class="widget-body">
                <div class="widget-vs">
                  <div class="d-flex align-items-center justify-content-around justify-content-between w-100">
                    <div class="team-1 text-center">
                      <img class="mb-3" :src="match.opponent.photo" alt="Image">
                      <h3>{{ match.opponent.name }}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-center">
                <h5>{{ match.venue }}</h5>
                <p>
                  <span class="d-block">{{ match.date }}</span>
                </p>
              </div>
            
          </div>
        </div>
      </div>
    </div>

    <match-detail v-else :match="detailData" @close="detailData=null"/>
  </main>
</template>

<script>
import { doc, getDoc } from 'firebase/firestore'
import { useLoginStore } from '../stores/login'
import MatchDetail from './MatchDetail.vue'
export default {
  components: { MatchDetail },
  name: 'my-match',
  data() {
    return {
      matchHistory: [],
      nextMatch: {
        opponent: {}
      },
      detailData: null
    }
  },
  methods: {
    async getMatchList() {
      const userStore = useLoginStore()
      const docRef = doc(this.$db, "match-list", userStore.userData.user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const matches = docSnap.data().matches
        console.log(docSnap.data())
        this.matchHistory = matches
          .filter(match => match.status === 1)
          .map(match => ({
            ...match,
            date: this.formatDate(match.date)
          }))

        this.nextMatch = {
          ...matches.find(match => match.status === 0),
          date: this.formatDate(matches.find(match => match.status === 0)?.date)
        } || {}
      }
    },
    formatDate(timestamp) {
      const date = new Date(timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1e6);
      return new Intl.DateTimeFormat('id-ID', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
    }
  },
  beforeMount() {
    this.getMatchList()
  }
}
</script>

<style lang="scss" scoped>
.widget-next-match {
  border: 1px solid rgba(255, 255, 255, 0.1);

  .widget-title {
    padding: 16px 20px;
    background-color: #ee1e46;

    h3 {
      margin: 0;
      padding: 0;
      font-size: 16px;
      font-weight: 700;
    }
  }

  .widget-vs {
    img {
      border-radius: 50%;
      aspect-ratio: 1/1;
      width: 200px;
    }
  }
}

.upcoming {
  position: relative;
  margin-bottom: 15px;

  h3 {
    font-weight: 700;
    margin-left: 10px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 5px;
      background: var(--primary-color);
    }
  }
}

.list-wrapper {
  background: rgba(255, 255, 255, 0.05) !important;

  img {
    width: 150px;
    aspect-ratio: 1/1;
    border-radius: 50%;
  }
}

.widget-vs {
  img {
    border-radius: 50%;
    aspect-ratio: 1/1;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.list-wrapper {
  background: rgba(255, 255, 255, 0.05) !important;

  img {
    width: 100%;
    aspect-ratio: 1/1;
    border-radius: 50%;
    width: 200px;
    object-fit: cover;
  }
}
</style>

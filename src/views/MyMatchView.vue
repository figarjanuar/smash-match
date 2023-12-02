<template>
  <div v-if="isLoading" class="spinner-border page-loader" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <main v-else class="mb-5">
    <div v-if="!detailData" class="wrapper">
      <div class="row mb-5">
        <div class="col-lg-12">
          <div class="widget-next-match">
            <div class="widget-title mb-3">
              <h3 @click="goToNextMatch()" :class="[nextMatch.opponent.photo ? 'underline' : '']">Next Match</h3>
            </div>
            <div class="widget-body mb-3">
              <div class="widget-vs">
                <div class="d-flex align-items-center justify-content-around justify-content-between w-100">
                  <div @click="detailData = nextMatch" v-if="nextMatch.opponent.photo" class="text-center">
                    <img :src="nextMatch.opponent.photo" alt="Image">
                    <h3 class="mt-3">{{ nextMatch.opponent.name }}</h3>
                  </div>
                </div>
              </div>
            </div>
  
            <div @click="detailData = nextMatch" v-if="nextMatch.opponent.photo" class="text-center widget-vs-contents mb-4">
              <h5>{{ gorMapping(nextMatch.venue) }}</h5>
              <p class="mb-5">
                <span class="d-block">{{ nextMatch.formatedDate }}</span>
              </p>
            </div>

            <div v-else class="text-center mb-5">
              <h3>Belum ada pertandingan</h3>
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

        <div v-for="(match, index) in matchHistory" :key="index" class="col-lg-12 mb-2">
          <div @click="detailData = match" class="p-4 rounded list-wrapper d-flex align-items-center">
            <img :src="match.opponent.photo" alt="Image">
            <div class="widget-body">
              <div class="widget-vs">
                <div class="d-flex">
                  <div class="team-1 text-center">
                    <h5>{{ match.opponent.name }}</h5>
                  </div>
                </div>
              </div>

              <div>
                <p style="font-size: 12px;" class="m-0">{{ gorMapping(match.venue) }}, {{ match.formatedDate }}</p>
              </div>
            </div>
            <p
              class="m-0 text-uppercase bold"
              :class="[
                match.status == 'win' ? 'text-success' :
                match.status == 'lose' ? 'text-danger' : '']">
                {{ match.status }}</p>
          </div>
        </div>
      </div>
    </div>

    <match-detail v-else :match="detailData" @close="closeDetail()"/>
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
      detailData: null,
      isLoading: true
    }
  },
  methods: {
    async getMatchList() {
      const userStore = useLoginStore()
      const docRef = doc(this.$db, "match-list", userStore.userData.user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const matches = docSnap.data().matches

        this.matchHistory = matches
          .filter(match => match.status !== 'berlangsung')
          .map(match => ({
            ...match,
            formatedDate: this.formatDate(match.date)
          }))

        if(matches.find(match => match.status === 'berlangsung')) {
          this.nextMatch = {
            ...matches.find(match => match.status === 'berlangsung'),
            formatedDate: this.formatDate(matches.find(match => match.status === 'berlangsung')?.date)
          } || {}
        }
      }

      this.isLoading = false
    },
    formatDate(timestamp) {
      const date = new Date(timestamp?.seconds * 1000 + timestamp?.nanoseconds / 1e6);
      return new Intl.DateTimeFormat('id-ID', { month: 'long', day: 'numeric', year: 'numeric' }).format(date)
    },
    closeDetail() {
      this.nextMatch = { opponent: {} }
      this.getMatchList()
      this.detailData = null
    },
    gorMapping(id) {
      const gor = {
        'gor-1': 'GOR Dramaga'
      }

      return gor[id]
    },
    goToNextMatch() {
      if(this.nextMatch.opponent.photo) {
        this.detailData = this.nextMatch
      }
    }
  },
  beforeMount() {
    this.getMatchList()
  }
}
</script>

<style lang="scss" scoped>
.underline {
  text-decoration: underline;
}

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
      width: 150px;
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
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05) !important;
  gap: 20px;

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
    aspect-ratio: 1/1;
    border-radius: 50%;
    width: 10%;
    object-fit: cover;
  }
}
</style>

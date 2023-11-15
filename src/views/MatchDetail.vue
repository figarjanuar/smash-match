<template>
  <div class="row mb-5">
    <div class="col-12">
      <card-component
        style="margin-bottom: 50px; position: relative;"
        :title="'Detail Match'"
        :name="match.opponent.name"
        :image="match.opponent.photo"
      >
      <div class="close" @click="$emit('close')">x</div>
      <div v-if="match.status === 'berlangsung'" class="alert alert-warning p-2 m-3">
        <small class="">Silahkan kontak pemain lawan untuk menentukan jam pertandingan</small>
      </div>

      <div class="profile-wrapper p-3">
        <h5 class="mb-3 text-center">Profile Pemain</h5>

        <div class="d-flex">
          <div class="desc">Total Game</div>
          <div class="val">{{ totalGame }}</div>
        </div>
        <div class="d-flex">
          <div class="desc">Usia</div>
          <div class="val">21</div>
        </div>
        <div class="d-flex">
          <div class="desc">No Hp</div>
          <div class="val number">
            <a target="_blank" :href="`https://api.whatsapp.com/send?phone=62${match.opponent.phone}`">
              {{ match.opponent.phone }}
            </a>
          </div>
        </div>
      </div>

      <div class="match-wrapper p-3">
        <h5 class="mb-3 text-center">Detail Pertandingan</h5>

        <div class="d-flex">
          <div class="desc">Lapangan</div>
          <div class="val">{{ gorMapping(match.venue) }}</div>
        </div>
        <div class="d-flex">
          <div class="desc">Tanggal</div>
          <div class="val">{{ match.formatedDate }}</div>
        </div>
        <div class="d-flex">
          <div class="desc">Status</div>
          <div class="val text-uppercase">{{ match.status }}</div>
        </div>
      </div>

      <div v-if="match.status === 'berlangsung'" class="match-wrapper p-3">
        <h5 class="mb-3 text-center">Sroce</h5>
        <div class="d-flex add-wrapper">
          <button @click="addScore" class="btn btn-success">+</button>
          <button @click="removeScore" class="btn btn-warning">-</button>
        </div>
        <div v-for="(val, index) in score" :key="index" class="d-flex score">
          <div class="desc">
            <input v-model="val.me" :placeholder="playerName" type="number" class="form-control">
          </div>
          <div class="val">
            <input v-model="val.opponent" :placeholder="match.opponent.name" type="number" class="form-control">
          </div>
        </div>

        <button @click="endMatch" class="btn btn-primary end-match">End Match</button>
      </div>
    </card-component>
    </div>
  </div>
</template>

<script>
import { doc, getDoc, setDoc } from 'firebase/firestore';
import CardComponent from '../components/CardComponent.vue';
import { useLoginStore } from '../stores/login';

export default {
  components: { CardComponent },
  props: {
    match: {
      type: Object,
      default: null
    },
    totalGame: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      score: [
        {me: null, opponent: null}
      ]
    }
  },
  methods: {
    addScore() {
      this.score.push({me: null, opponent: null})
    },
    gorMapping(id) {
      const gor = {
        'gor-1': 'GOR Dramaga'
      }

      return gor[id]
    },
    removeScore() {
      this.score.pop()
    },
    async endMatch() {
      const point = this.score.reduce((acc, val) => acc + (val.me > val.opponent ? 1 : -1), 0)
      const status = point === 0 ? 'draw' : (point > 0 ? 'win' : 'lose')
      
      const loginStore = useLoginStore()
      const matchListDocRef = doc(this.$db, "match-list", loginStore.userData.user.uid)
      const matchListSnap = await getDoc(matchListDocRef)

      if (matchListSnap.exists()) {
        const matchListData = matchListSnap.data().matches || [];
        const matchIndex = matchListData.findIndex(matchList => 
          matchList.date.seconds == this.match.date.seconds
        )

        if (matchIndex !== -1) {
          matchListData[matchIndex].status = status;
          await setDoc(matchListDocRef, { matches: matchListData })
          this.$emit('close')
        }
      }
    }
  },
  computed: {
    playerName() {
      const loginStore = useLoginStore()
      return loginStore.userData.user.displayName
    }
  }
}
</script>

<style lang="scss" scoped>
.close {
  position: absolute;
  top: 13px;
  right: 20px;
  cursor: pointer;
}

.d-flex {
  justify-content: space-between;
  margin-bottom: 8px;
  .val {
    font-weight: 700;
  }

  .number {
    a {
      font-weight: 700;
      text-decoration: underline;
      color: #fff;
    }
  }
}

.match-wrapper {
  h3 {
    text-align: end;
  }
}

.score {
  gap: 10px;
}

.end-match {
  width: 100%;
}
</style>
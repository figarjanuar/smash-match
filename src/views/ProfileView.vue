<template>
  <div v-if="isPageLoading" class="spinner-border page-loader" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
  <div v-else class="row no-gutters">
    <div class="col-lg-6 mx-auto p-0">
      <div class="post-entry">
        <a href="#">
          <img :src="getPhoto" alt="Image" class="img-fluid">
        </a>
        <div class="caption">
          <div class="caption-inner">
            <div class="author d-flex align-items-center">
              <div class="text">
                <input
                  v-if="isEdit"
                  type="file"
                  ref="input1"
                  class="form-control mb-2"
                  placeholder="Location"
                  @change="changeImage">

                <input
                  v-if="isEdit"
                  type="text"
                  class="form-control"
                  placeholder="Name"
                  v-model="user.displayName">
                <h4 v-else>{{ user.displayName }}</h4>
                <span>{{ user.point }} {{ user.rank }}</span>
              </div>

              <div class="ms-2 edit">
                <button v-if="!isEdit" class="btn btn-success" @click="isEdit=true">Edit</button>
                <button v-else class="btn btn-danger" @click="createOrUpdateUser">
                  <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span v-else>Simpan</span>
                </button>
              </div>
            </div>
          </div>
        </div> 
      </div>
    </div>

    <div class="row mx-auto mt-4">
      <div class="col-12">
        <div class="p-4 rounded list-wrapper d-flex mb-4">
          <div class="d-flex detail">
            <p>Total Game</p>
            <p class="bold">{{ user.totalMatch }}</p>
          </div>
          <!-- kota -->
          <div class="detail">
            <div v-if="isEdit" class="edit-data">
              <label>Kota</label>
              <input
                type="text"
                class="form-control"
                placeholder="Kota"
                v-model="user.location">
            </div>
            <div v-else class="d-flex">
              <p>Kota</p>
              <p class="bold">{{ user.location }}</p>
            </div>
          </div>
          <!-- tanggal lahit -->
          <div class="detail">
            <div v-if="isEdit" class="edit-data">
              <label>Tanggal Lahir</label>
              <input
                type="date"
                class="form-control"
                placeholder="Date of birth"
                v-model="user.dob">
            </div>
            <div v-else class="d-flex">
              <p>Tanggal Lahir</p>
              <p class="bold">{{ user.dob }}</p>
            </div>
          </div>
          <!-- usia -->
          <div class="detail">
            <div class="d-flex">
              <p>Usia</p>
              <p class="bold">{{ getAge(user.dob) }}</p>
            </div>
          </div>
          <!-- jenis kelamin -->
          <div class="detail">
            <div v-if="isEdit" class="edit-data">
              <label>Jenis Kelamin</label>
              <select v-model="user.gender" class="form-select">
                <option value="1">Laki - laki</option>
                <option value="2">Perempuan</option>
              </select>
            </div>
            <div v-else class="d-flex">
              <p>Jenis Kelamin</p>
              <p class="bold">{{ getGender(user.gender) }}</p>
            </div>
          </div>
          <!-- no hp -->
          <div class="detail">
            <div v-if="isEdit" class="edit-data">
              <label>No HP</label>
              <input
                v-if="isEdit"
                type="number"
                class="form-control"
                placeholder="Ex. 856XXX"
                v-model="user.phone">
            </div>
            <div v-else class="d-flex">
              <p>No HP</p>
              <p class="bold">{{ user.phone }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Experience -->
    <div class="row mx-auto mt-4">
      <div class="col-12">
        <p class="section">Pengalaman</p>
        <div class="p-4 rounded list-wrapper d-flex mb-4">
          <div class="detail">
            <select v-if="isEdit" v-model="experience.isCompe" class="form-select">
              <option value="" selected disabled>Bermain Untuk</option>
              <option value="0">Olahraga</option>
              <option value="1">Kompetitif</option>
            </select>
            <div v-else class="d-flex">
              <p>Bermain Untuk</p>
              <p class="bold">{{ compeMapping(experience.isCompe) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- fisik -->
    <div class="row mx-auto mt-4">
      <div class="col-12">
        <p class="section">Fisik</p>
        <div class="p-4 rounded list-wrapper d-flex mb-4">
          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label class="form-label">Kekuatan</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="fisik.strength" min="0" max="5" type="range" class="form-range">
                <span>{{ fisik.strength }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Kekuatan Fisik</p>
              <p class="bold">{{ fisik.strength }}</p>
            </div>
          </div>

          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label for="customRange1" class="form-label">Daya Tahan</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="fisik.endurance" min="0" max="5" type="range" class="form-range">
                <span>{{ fisik.endurance }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Daya Tahan</p>
              <p class="bold">{{ fisik.endurance }}</p>
            </div>
          </div>

          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <input v-model="fisik.playTime" placeholder="Rata - rata Lama Bermain (jam)" type="number" class="form-control">
            </div>
            <div v-else class="d-flex">
              <p>Rata - rata Lama Bermain</p>
              <p class="bold">{{ fisik.playTime }} Jam</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- teknikal -->
    <div class="row mx-auto mt-4">
      <div class="col-12">
        <p class="section">Kemampuan Teknikal</p>
        <div class="p-4 rounded list-wrapper d-flex mb-4">
          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label class="form-label">Pukulan Service</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="technical.service" min="0" max="5" type="range" class="form-range">
                <span>{{ technical.service }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Pukulan Service</p>
              <p class="bold">{{ technical.service }}</p>
            </div>
          </div>

          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label class="form-label">Pengembalian Bola</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="technical.ballReturn" min="0" max="5" type="range" class="form-range">
                <span>{{ technical.ballReturn }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Pengembalian Bola</p>
              <p class="bold">{{ technical.ballReturn }}</p>
            </div>
          </div>

          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label class="form-label">Pukulan Smash</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="technical.smash" min="0" max="5" type="range" class="form-range">
                <span>{{ technical.smash }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Pukulan Smash</p>
              <p class="bold">{{ technical.smash }}</p>
            </div>
          </div>

          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label class="form-label">Refleks dan Kecepatan</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="technical.speed" min="0" max="5" type="range" class="form-range">
                <span>{{ technical.speed }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Refleks dan Kecepatan</p>
              <p class="bold">{{ technical.speed }}</p>
            </div>
          </div>

          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label class="form-label">Akurasi</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="technical.accuracy" min="0" max="5" type="range" class="form-range">
                <span>{{ technical.accuracy }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Akurasi</p>
              <p class="bold">{{ technical.accuracy }}</p>
            </div>
          </div>

          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label class="form-label">Pemahaman Peraturan</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="technical.rule" min="0" max="5" type="range" class="form-range">
                <span>{{ technical.rule }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Pemahaman Peraturan</p>
              <p class="bold">{{ technical.rule }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mx-auto mt-4">
      <div class="col-12">
        <p class="section">Perlengkapan</p>
        <div class="p-4 rounded list-wrapper d-flex mb-4">
          <div class="detail">
            <div v-if="isEdit" class="input-wrapper">
              <label class="form-label">Kualitas Raket</label>
              <div class="d-flex" style="gap: 10px;">
                <input v-model="equipment.racket" min="0" max="5" type="range" class="form-range">
                <span>{{ equipment.racket }}</span>
              </div>
            </div>
            <div v-else class="d-flex">
              <p>Kualitas Raket</p>
              <p class="bold">{{ equipment.racket }}</p>
            </div>
          </div>
      </div>
    </div>
    </div>

    <div class="row mx-auto mt-4">
      <div class="col-12">
        <p class="section">Prestasi Sebelumnya</p>
        <div class="p-4 rounded list-wrapper d-flex mb-4">
          <div class="detail">
            <div class="d-flex">
              <p>Berpartisipasi dalam Turnamen</p>
              <input
                :disabled="!isEdit"
                class="form-check-input"
                type="checkbox" v-model="achievements.tournaments" id="flexCheckDefault">
            </div>
          </div>
          <div class="detail">
            <div class="d-flex">
              <p>Bergabung dalam Club</p>
              <input
                :disabled="!isEdit"
                class="form-check-input"
                type="checkbox" v-model="achievements.club" id="flexCheckDefault">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isEdit" class="row row mx-auto mb-5">
      <div class="col-12">
        <button @click="doLogout()" class="btn btn-danger" style="width: 100%;">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useSawStore } from "../stores/saw";

export default {
  data() {
    return {
      isPageLoading: true,
      uploadValue: 0,
      isLoading: false,
      user: {
        displayName: '',
      },
      experience: {
        isCompe: ''
      },
      fisik: {
        strength: 0,
        endurance: 0,
        playTime: ''
      },
      technical: {
        service: 0,
        ballReturn: 0,
        smash: 0,
        speed: 0,
        accuracy: 0,
        rule: 0
      },
      equipment: {
        racket: 0,
      },
      achievements: {
        tournaments: false,
        club: false
      },
      isEdit: false,
      imageProfile: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
    }
  },
  methods: {
    changeImage(event) {
      this.user.photo = URL.createObjectURL(event.target.files[0])

      const storage = getStorage();
      const storageRef = ref(storage, Math.floor(Math.random() * 100)+event.target.files[0].name)

      uploadBytes(storageRef, event.target.files[0]).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          this.imageProfile = downloadURL
          this.user.photo = downloadURL
        })
      })
    },
    getUser() {
      const auth = getAuth()
      this.user = auth.currentUser

      this.getUserByUserId(this.user.uid)
    },
    async createOrUpdateUser() {
      try {
        this.isLoading = true
        const userRef = doc(this.$db, "users", this.user.uid)

        const sawStore = useSawStore()
        const userData = {
          experience: this.experience,
          fisik: this.fisik,
          technical: this.technical,
          equipment: this.equipment,
          achievements: {
            tournaments: this.achievements.tournaments ? 1 : 0,
            club: this.achievements.club ? 1 : 0
          },
        }
        const score = sawStore.generateScore(userData)

        const saveData = {
          location: this.user.location,
          phone: this.user.phone,
          dob: this.user.dob,
          age: this.getAge(this.user.dob),
          photo: this.user.photo || this.imageProfile,
          gender: this.user.gender,
          experience: this.experience,
          fisik: this.fisik,
          technical: this.technical,
          equipment: this.equipment,
          achievements: this.achievements,
          score,
          isFindMatch: false,
          displayName: this.user.displayName
        }
        console.log(saveData)
        if(isNaN(score )) {
          alert('Harap Lengkapi Data!')
          this.isLoading = false
          return
        }
        await setDoc(userRef, saveData, { merge: true })

        const auth = getAuth()
        updateProfile(auth.currentUser, {
          displayName: this.user.displayName
        })

        this.isEdit = false
        this.isLoading = false
      } catch (e) {
        this.isLoading = false
        alert('Harap Lengkapi Data!')
        console.error("Error creating or updating document: ", e);
      }
    },
    async getUserByUserId(userId) {
      try {
        const docRef = doc(this.$db, "users", userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          this.user = {
            ...this.user,
            gender: docSnap.data().gender,
            dob: docSnap.data().dob,
            location: docSnap.data().location,
            photo: docSnap.data().photo,
            score: docSnap.data().score,
            phone: docSnap.data().phone,
          }
          this.experience = docSnap.data().experience
          this.fisik = docSnap.data().fisik
          this.technical = docSnap.data().technical
          this.equipment = docSnap.data().equipment
          this.achievements = docSnap.data().achievements
        }

        const matchRef = doc(this.$db, "match-list", userId)
        const matchSnap = await getDoc(matchRef)

        if(matchSnap.exists()) {
          this.user = {
            ...this.user,
            totalMatch: matchSnap.data().matches.length
          }
        }
      } catch (e) {
        alert("Error getting user document: "+e)
      } finally {
        this.isPageLoading = false
      }
    },
    getAge(date) {
      const birthdate = new Date(date)
      const currentDate = new Date()

      const ageInMilliseconds = currentDate - birthdate

      const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)
      return Math.floor(ageInYears) || null
    },
    getGender(genderId) {
      const data = {
        1: 'Laki - laki',
        2: 'Perempuan'
      }
      return data[genderId]
    },
    howLongMapping(id) {
      const data = {
        1: '< 1 Tahun',
        2: '1 - 5 Tahun',
        3: '> 5 Tahun'
      }

      return data[id]
    },
    compeMapping(isCompe) {
      const data = {
        0: 'Olahraga',
        1: 'Kompetitif'
      }
      return data[isCompe]
    },
    doLogout() {
      localStorage.clear()
      this.$router.push({ name: 'login' })
    }
  },
  mounted() {
    this.getUser()
  },
  computed: {
    getPhoto() {
      return this.user.photo ? this.user.photo : this.imageProfile
    }
  }
}
</script>

<style lang="scss" scoped>
  .logout-wrapper {
    position: absolute;
    z-index: 9;
    top: 0;
    background: rgba(0,0,0, .3);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    p {
      margin: 0;
      text-align: end;
      padding: 10px;
    }
  }

  .author {
    justify-content: space-between;
  }
  .post-entry {
    margin-top: -1rem;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
    }

    .caption {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
      z-index: 1;

      .caption-inner {
        position: absolute;
        bottom: 0px;
        right: 0px;
        padding: 1.25rem;
        background: rgba(0, 0, 0, 0.2);
        width: 100%;

        h3 {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }
      }
    }
  }

  .list-wrapper {
    flex-direction: column;
    gap: 1.25rem;

    .detail {
      justify-content: space-between;
      text-transform: capitalize;
  
      p:nth-child(1), label {
        opacity: 0.5;
      }
  
      p, label {
        margin: 0;
        font-size: 14px;
      }

      .d-flex {
        justify-content: space-between;
      }
    }
  }

  .section {
    position: relative;
    font-weight: 600;
    padding-left: 15px;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: 5px;
      background: var(--primary-color);
    }
  }
</style>
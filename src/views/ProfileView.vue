<template>
  <div class="row no-gutters">
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
                  placeholder="Location"
                  v-model="user.displayName">
                <h4 v-else>{{ user.displayName }}</h4>
                <span>{{ user.point }} {{ user.rank }}</span>
              </div>

              <div class="ms-2 edit">
                <button v-if="!isEdit" class="btn btn-success" @click="isEdit=true">Edit</button>
                <button v-else class="btn btn-danger" @click="createOrUpdateUser">Save</button>
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
            <p>win rate</p>
            <p class="bold">0%</p>
          </div>
          <div class="detail">
            <input
              v-if="isEdit"
              type="text"
              class="form-control"
              placeholder="Location"
              v-model="user.location">
            <div v-else class="d-flex">
              <p>Location</p>
              <p class="bold">{{ user.location }}</p>
            </div>
          </div>
          <div class="detail">
            <input
              v-if="isEdit"
              type="date"
              class="form-control"
              placeholder="Date of birth"
              v-model="user.dob">
            <div v-else class="d-flex">
              <p>DoB</p>
              <p class="bold">{{ user.dob }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Experience -->
    <div class="row mx-auto mt-4">
      <div class="col-12">
        <p class="section">Experience</p>
        <div class="p-4 rounded list-wrapper d-flex mb-4">
          <div class="detail">
            <input
              v-if="isEdit"
              type="text"
              class="form-control"
              placeholder="Play per Week"
              v-model="experience.playPerWeek">
            <div v-else class="d-flex">
              <p>Play per Week</p>
              <p class="bold">{{ experience.playPerWeek }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default {
  data() {
    return {
      uploadValue: 0,
      user: {
        displayName: ''
      },
      experience: {
        playPerWeek: ''
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
        const userRef = doc(this.$db, "users", this.user.uid);
        await setDoc(userRef, {
          location: this.user.location,
          dob: this.user.dob,
          photo: this.user.photo
        }, { merge: true })

        const auth = getAuth()
        updateProfile(auth.currentUser, {
          displayName: this.user.displayName
        })

        this.isEdit = false
      } catch (e) {
        console.error("Error creating or updating document: ", e);
      }
    },
    async getUserByUserId(userId) {
      try {
        const docRef = doc(this.$db, "users", userId)
        const docSnap = await getDoc(docRef)
        console.log(docSnap)

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          this.user = {
            ...this.user,
            ...docSnap.data()
          }
        } else {
          console.log("No such document!");
        }
      } catch (e) {
        console.error("Error getting user document: ", e);
      }
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
  
      p:nth-child(1) {
        opacity: 0.5;
      }
  
      p {
        margin: 0;
        font-size: 18px;
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
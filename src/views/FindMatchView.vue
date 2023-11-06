<template>
  <div class="container">
    <div class="about">
      <h1>Find a Match</h1>
      <div class="wrapper">
        <div class="mb-3">
          <label for="location" class="form-label">Location</label>
          <select v-model="selectedLocation" class="form-select" id="location">
            <option value="location1">Location 1</option>
            <option value="location2">Location 2</option>
            <option value="location3">Location 3</option>
          </select>
        </div>

        <div class="mb-3">
          <label for="location" class="form-label">Venue</label>
          <select v-model="selectedVenue" class="form-select" id="location">
            <option value="location1">Gor 1</option>
            <option value="location2">Gor 1</option>
            <option value="location3">Gor 1</option>
          </select>
        </div>
        
        <button type="submit" class="btn btn-primary mt-3" :disabled="loading" v-on:click="findMatch()">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Find Match</span>
        </button>
      </div>
      <div v-if="matchFound" class="alert alert-success mt-3">
        Match found! Display your result here.
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedLocation: '',
      selectedVenue: '',
      loading: false,
      matchFound: false,
    };
  },
  methods: {
    findMatch() {
      // Simulate loading with a timeout
      this.loading = true
      this.matchFound = true
      this.loading = false
    }
  },
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
      min-width: 100%;
      display: flex;
      flex-direction: column;
    }

    h1 {
      text-align: center;
    }
  }
</style>

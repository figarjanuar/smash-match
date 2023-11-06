<template>
  <div class="row">
    <div class="col-12">
      <card-component
        :title="'Detail Match'"
        :name="'Abdul'"
        :image="'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'"
      >
      <div class="alert alert-warning p-2 m-3">
        <small class="">Silahkan kontak pemain lawan untuk menentukan jam pertandingan</small>
      </div>

      <div class="profile-wrapper p-3">
        <h5 class="mb-3 text-center">Profile Pemain</h5>

        <div class="d-flex">
          <div class="desc">Win Rate</div>
          <div class="val">90%</div>
        </div>
        <div class="d-flex">
          <div class="desc">Usia</div>
          <div class="val">21</div>
        </div>
        <div class="d-flex">
          <div class="desc">No Hp</div>
          <div class="val number">0856083890</div>
        </div>
      </div>

      <div class="match-wrapper p-3">
        <h5 class="mb-3 text-center">Detail Pertandingan</h5>

        <div class="d-flex">
          <div class="desc">Area</div>
          <div class="val">Bogor</div>
        </div>
        <div class="d-flex">
          <div class="desc">Lapangan</div>
          <div class="val">Gor PGRI</div>
        </div>
        <div class="d-flex">
          <div class="desc">Tanggal</div>
          <div class="val">6 Nov 2023</div>
        </div>
        <div class="d-flex">
          <div class="desc">Status</div>
          <div class="val">Upcoming</div>
        </div>
      </div>
    </card-component>
    </div>
  </div>
</template>

<script>
import CardComponent from '../components/CardComponent.vue';

export default {
  components: { CardComponent }
}
</script>

<style lang="scss" scoped>
.d-flex {
  justify-content: space-between;
  margin-bottom: 8px;
  .val {
    font-weight: 700;
  }

  .number {
    text-decoration: underline;
    color: #fff;
  }
}

.match-wrapper {
  h3 {
    text-align: end;
  }
}
</style>
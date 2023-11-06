<template>
  <main>
    <div class="wrapper">
      <div class="row mb-5">
        <div class="col-lg-12">
          <div class="widget-next-match">
            <div class="widget-title mb-3">
              <h3>Next Match</h3>
            </div>
            <div class="widget-body mb-3">
              <div class="widget-vs">
                <div class="d-flex align-items-center justify-content-around justify-content-between w-100">
                  <div class="text-center">
                    <img src="https://picsum.photos/id/64/200" alt="Image">
                    <h3>M Satya</h3>
                  </div>
                </div>
              </div>
            </div>
  
            <div class="text-center widget-vs-contents mb-4">
              <h5>PB Dramaga</h5>
              <p class="mb-5">
                <span class="d-block">15 Desember 2023</span>
                <span class="d-block">9:30</span>
              </p>
  
              <div id="date-countdown2" class="pb-1"><span class="countdown-block"><span class="label">524</span> weeks </span><span class="countdown-block"><span class="label">06</span> days </span><span class="countdown-block"><span class="label">08</span> hr </span><span class="countdown-block"><span class="label">35</span> min </span><span class="countdown-block"><span class="label">33</span> sec</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <div class="upcoming">
            <h3>Upcoming Match</h3>
          </div>
        </div>

        <div v-for="i in 10" :key="i" class="col-lg-6 mb-4">
          <div class="p-4 rounded list-wrapper">
            <div class="widget-body">
                <div class="widget-vs">
                  <div class="d-flex align-items-center justify-content-around justify-content-between w-100">
                    <div class="team-1 text-center">
                      <img src="https://picsum.photos/id/64/200" alt="Image">
                      <h3>Jajang</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div class="text-center">
                <h5>World Cup League</h5>
                <p>
                  <span class="d-block">December 20th, 2020</span>
                  <span class="d-block">9:30 AM GMT+0</span>
                </p>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

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
</style>

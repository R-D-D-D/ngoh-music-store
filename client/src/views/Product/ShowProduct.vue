<template lang="pug">
  v-container(v-if="product")
    v-row.mt-8.justify-center
      v-col(cols="11" md="8" xl="6")
        v-row.justify-center
          v-col(cols="12")
            div.displayed-file(draggable="true" @touchstart="drag($event)" @touchend="dragEnd($event)" style="position:relative;")
              v-chip.ma-2(small style="position: absolute; top:0; right:0; z-index:1;") {{ displayedFile.position + 1 }}/{{ product.Files.length }}
              v-img(:src="displayedFile.url" :aspect-ratio="4/3" max-height="100%" contain v-if="displayedFile.type.includes('image')")
              div.video-container(v-else)
                video.video(controls)
                  source(:src="displayedFile.url" type="video/mp4")

        v-row.justify-start
          v-col(v-for="(file, idx) in product.Files" cols="3" md="2" @mouseover="changeDisplay($event, file)" :class="{selected: file == displayedFile, thumbnail: !isPhone}")
            v-img(:src="file.url" :aspect-ratio="4/3" max-height="100%" contain v-if="file.type.includes('image')")
            div.video-container(v-else style="position:relative;")
              video.video
                source(:src="file.url" type="video/mp4")
              div(style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;")
                img(:src="require('../../assets/play_button.png')" style="position: absolute; width: 20px; height:20px; left: calc(50% - 10px); top: calc(50% - 10px);" color="white" size="62" )

      v-col.pl-md-8(cols="11" md="4" xl="6")
        h1.font-weight-black(style="font-size:2.6rem;") {{ product.name }}
        div.font-weight-black(style="font-size:1.6rem; color:#616161;") S$ {{ product.price.toFixed(2) }}
        div.font-weight-medium(style="font-size:1.6rem;" v-if="product.isNew != undefined && product.isNew == true") New
        div.font-weight-medium(style="font-size:1.6rem;" v-if="product.isNew != undefined && product.isNew == false") Used
        div.font-weight-medium(style="font-size:1.6rem;") {{ product.description }}
        
        v-row
          v-col(cols="12")
            v-btn.font-weight-bold(large color="#1EBEA5" dark href="https://wa.me/6598638720" target="blanck")
              v-icon(left size="30") $vuetify.icons.whatsapp
              | Contact Me
          v-col.pt-0(cols="12")
            v-btn.font-weight-bold(large color="#ff2636" dark href="https://sg.carousell.com/fountain_pen_trove" target="blanck")
              v-icon(left size="26" color="#ffffff") $vuetify.icons.carousell
              | Carousell

</template>

<script>
import ProductService from '@/services/ProductService'

export default {
  name: 'ShowProduct',
  data () {
    return {
      product: null,
      displayedFile: null,
      player: null,
      startX: 0,
    }
  },

  computed: {
    isPhone () {
      return (this.$vuetify.breakpoint.name == 'xs' || this.$vuetify.breakpoint.name == 'sm')
    }
  },

  methods: {
    changeDisplay (event, file) {
      this.displayedFile = file
    },

    goNext () {
      this.displayedFile = this.product.Files[(this.displayedFile.position + 1) % this.product.Files.length]
    },

    goPrev () {
      this.displayedFile = this.product.Files[Math.abs((this.displayedFile.position - 1)) % this.product.Files.length]
    },

    drag (event) {
      this.startX = event.changedTouches[0].clientX
    },

    dragEnd (event) {
      if (event.changedTouches[0].clientX - this.startX > 0) {
        this.goPrev()
      } else if (event.changedTouches[0].clientX - this.startX < 0) {
        this.goNext()
      }
    } 
  },

  mounted: async function () {
    this.product = (await ProductService.show(this.$route.params.product_id)).data.product
    this.product.Files = this.product.Files.sort(function(a, b) {
      return a.position - b.position;
    })
    this.displayedFile = this.product.Files[0]
  }
}
</script>

<style>
.video-container {
    /* width is set as 100% here. any width can be specified as per requirement */
    width: 100%;
    padding-top: 75%;
    height: 0px;
    position: relative;
    background-color: black;
}

.thumbnail-video-container {
    /* width is set as 100% here. any width can be specified as per requirement */
    width: 100%;
    height: 100%;
    position: relative;
    background-color: black;
}

.video {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.thumbnail:hover {
  cursor:pointer;
  border: 1px solid #BDBDBD;
  border-radius: 4px;
}

.selected {
  border: 1px solid #BDBDBD;
  border-radius: 4px;
}

ul {
  padding-left: 0px !important;
}
</style>
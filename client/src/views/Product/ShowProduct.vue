<template lang="pug">
  v-container(v-if="product")
    v-row.mt-8.justify-center
      v-col(cols="11" md="8" xl="6")
        //- carousel#carousel(v-bind="settings" :slidesToShow="1")
        //-   div(v-for="image in product.Images" :key="image.id")
        //-     v-img.px-2(:src="image.url" :aspect-ratio="4/3")
        //-   div(v-for="image in product.Images" :key="image.id")
        //-     v-img.px-2(:src="require('../../assets/IMG_9405.png')" :aspect-ratio="4/3")
        //-   div.video-container
        //-     video.video(controls)
        //-       source(:src="require('../../assets/Verse 1 and chorus.mp4')")

        v-row.justify-center
          v-col(cols="12")
            agile.main(ref="main" :options="options1" :as-nav-for="asNavFor1" style="background-color:black;")
              div.slide(v-for="(slide, index) in slides", :key="index", :class="`slide--${index}`")
                v-img(:src="slide.src" :aspect-ratio="4/3" max-height="100%" contain v-if="slide.isImage")
                div.video-container(v-else)
                  video.video(controls width="100%")
                    source(:src="slide.src" type="video/mp4")


            agile.thumbnails(ref="thumbnails" :options="options2" :as-nav-for="asNavFor2")
              div.slide.slide--thumbniail(v-for="(slide, index) in slides", :key="index", :class="`slide--${index}`" @click="$refs.thumbnails.goTo(index)")
                v-img(:src="slide.src" :aspect-ratio="4/3" max-height="100%" contain v-if="slide.isImage")
                div(v-else style="position:relative; width:100%;")
                  video(width="100%")
                    source(:src="slide.src" type="video/mp4")
                  div(style="position: absolute; left: 0; top: 0; width: 100%; height: 100%;")
                    img(:src="require('../../assets/play_button.png')" style="position: absolute; width: 30px; height:30px; left: calc(50% - 15px); top: calc(50% - 15px);" color="white" size="62" )

              template(slot="prevButton")
                i.fas.fa-chevron-left

              template(slot="nextButton")
                i.fas.fa-chevron-right

            //- agile.main(:dots="true")
            //-   div(class="slide")
            //-     v-img.px-2(:src="require('../../assets/IMG_9405.png')" :aspect-ratio="4/3")
              
            //-   div(class="slide")
            //-     v-img.px-2(:src="require('../../assets/IMG_9405.png')" :aspect-ratio="4/3")

            //-   div(class="slide")
            //-     video(controls width="100%")
            //-       source(src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4" type="video/mp4")

      v-col.pl-md-8(cols="11" md="4" xl="6")
        h1.font-weight-black(style="font-size:2.6rem;") {{ product.name }}
        div.font-weight-black(style="font-size:1.6rem; color:#616161;") S$ {{ product.price.toFixed(2) }}
        div.font-weight-medium(style="font-size:1.6rem;") {{ product.description }}
        v-btn.mt-4.font-weight-bold(large color="#1EBEA5" dark href="https://wa.me/6598638720" target="blanck")
          v-icon(left large) $vuetify.icons.whatsapp
          | Contact Me

</template>

<script>
import ProductService from '@/services/ProductService'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';
// import videojs from "video.js";
import { VueAgile } from 'vue-agile'

export default {
  name: 'ShowProduct',
  data () {
    return {
      product: null,
      settings: {
        "dots": true,
        "infinite": true,
        "slidesToScroll": 1,
        // "autoplay": true,
        // "autoplaySpeed": 2000,
        // "pauseOnDotsHover": true,
        // "pauseOnFocus": true,
        // "pauseOnHover": true,

      },
      player: null,

      // VueAgile
      asNavFor1: [],
			asNavFor2: [],
			options1: {
				dots: false,
				fade: true,
				navButtons: false
			},
			
			options2: {
				// autoplay: true,
				centerMode: true,
				dots: false,
				navButtons: false,
				slidesToShow: 3,
				responsive: [
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 5
            }
          },
          
          {
            breakpoint: 1000,
            settings: {
              navButtons: true
            }
          }
        ]
				
			},
			
			slides: [
        {
          isImage: true,
					src: 'https://rhythm-academy.s3.amazonaws.com/ngohks%40gmail.com/CDS/Hey/files/test.HEIC'
        },
        {
          isImage: false,
					src: 'https://rhythm-academy.s3.ap-southeast-1.amazonaws.com/ngohks%40gmail.com/CDS/Hey/files/vertical_1080_test.MOV'
        },
			]
    }
  },

  computed: {
    slidesToShow () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 1
        case 'sm': return 1
        case 'md': return 3
        case 'lg': return 3
        case 'xl': return 3
        default: return 1
      }
    }
  },

  components: { 
    'carousel': VueSlickCarousel,
    agile: VueAgile
  },

  mounted: async function () {
    this.product = (await ProductService.show(this.$route.params.product_id)).data.product

    await this.$nextTick()
    this.asNavFor1.push(this.$refs.thumbnails)
		this.asNavFor2.push(this.$refs.main)
  }
}
</script>

<style>
@import '../../../node_modules/vue-agile/dist/VueAgile.css';

.video-container {
    /* width is set as 100% here. any width can be specified as per requirement */
    width: 100%;
    padding-top: 75%;
    height: 0px;
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

ul {
  padding-left: 0px !important;
}

.big-img {
  height: 100%;
  width: auto;
}

.big-img-wrapper {
  width:100%;
  height:60vh;
  background-color: black;
}

.slick-track div:focus {
  outline: none !important;
}

/* Icons */
@font-face {
  font-family: 'slick';
  src: url(data:application/font-woff;charset=utf-8;base64,d09GRgABAAAAAATsAA0AAAAAB2wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGRlRNAAAE0AAAABoAAAAcdIcYB0dERUYAAAS0AAAAHAAAAB4AJwANT1MvMgAAAZwAAABRAAAAYFAQ/45jbWFwAAACAAAAAFcAAAFiIhFFt2dhc3AAAASsAAAACAAAAAj//wADZ2x5ZgAAAmgAAAE1AAACLD+btmBoZWFkAAABMAAAAC8AAAA2AAEx+2hoZWEAAAFgAAAAHAAAACQD5QIFaG10eAAAAfAAAAAQAAAAFgZKAEpsb2NhAAACWAAAABAAAAAQATYBoG1heHAAAAF8AAAAHQAAACAASwBHbmFtZQAAA6AAAADcAAABbgUngcJwb3N0AAAEfAAAAC4AAABFOXjBpHjaY2BkYGAA4vMGfuHx/DZfGbiZGEDgfGFFPZxWZVBlvM14G8jlYABLAwAT1QnNAHjaY2BkYGC8zcDAoMfEAAJANiMDKmABADBkAe942mNgZGBgYGdwYWBiAAEQycgAEnMA8xkACcgAkwAAAHjaY2BmYmCcwMDKwMDow5jGwMDgDqW/MkgytDAwMDGwcjKAQQNQCZBSYICCgDTXFAYHhkTFSYwP/j9g0GO8/f82A0QNA+NtsBIFBkYANHMN4wAAAHjaY2KAACYIVoVAAALCAJt42mNgYGBmgGAZBkYGEIgB8hjBfBYGByDNw8DBwARkMzAkKigpTlCc9P8/WB0S7/+i+4/uld4rgZoAB4xsDHAhRiYgwcSApoCBcsBMBTNYGGgGAEdEDyUAAAAAAAAAAAAAZgCKANABFnjadZBdToNAEMd3CrtAl5TQLtS0LCoN0A8SGkBI+mAfPET75B1896HppfQcvnII4w3cLYpW6k4ymdn9z8xvBwEKUQg11OgBIXAYWUEQR1uIZoFGpLGxKy3PqrIq8+waXIfJ+5mQSSvkvXwRqqocu1D39QMl2JgvN9zzhsyk1GRDz+OBfzMioCqx0rtdLYo0SiZTZttsOkmidBkveKibFF4Oep9SI46bqk3Twhp4iihUemrMWFPy2NRbthfqKkHi/PxlJLITZdAiSj6ouZ+tn9eZz78DuD9LZYB6bZ8rlCAUVuVdkULjxV4sIEysIc/KSyPmnJDdjhCOdQ0fCTliTX/tjH3ysWao+71qaNjHQjcQwrcuyl+WLZQthCMotJP/h+Xjazz+hfTeRWmG4zOiSyif/q1OtAAAAHjabY49asNAEIU/2ZJDfkiRIvXapUFCEqpcptABUrg3ZhEiQoKVfY9UqVLlGDlADpAT5e16IUWysMz3hjfzBrjjjQT/EjKpCy+4YhN5yZoxcirPe+SMWz4jr6S+5UzSa3VuwpTnBfc8RF7yxDZyKs9r5IxHPiKv1P9iZqDnyAvMQ39UecbScVb/gJO03Xk4CFom3XYK1clhMdQUlKo7/d9NF13RkIdfy+MV7TSe2sl11tRFaXYmJKpWTd7kdVnJ8veevZKc+n3I93t9Jnvr5n4aTVWU/0z9AI2qMkV42mNgYkAGjAzogB0sysTgwtDOyMTIzJlYVJRfnpOaVsIFZhVlpmeUAABuKQkSAAAAAAAB//8AAnjaY2BkYGDgAWIxIGZiYARCNiBmAfMYAAPgADV42mNgYGBkAIKrS9Q5QPT5wop6GA0APf8GGAAA)
    format('woff');
}
/* Arrows */
.slick-prev,
.slick-next {
  font-size: 0;
  line-height: 0;

  position: absolute;
  top: 50%;

  display: block;

  width: 20px;
  height: 20px;
  padding: 0;
  -webkit-transform: translate(0, -50%);
  -ms-transform: translate(0, -50%);
  transform: translate(0, -50%);

  cursor: pointer;

  color: transparent;
  border: none;
  outline: none;
  background: transparent;
}
.slick-prev:hover,
.slick-prev:focus,
.slick-next:hover,
.slick-next:focus {
  color: transparent;
  outline: none;
  background: transparent;
}
.slick-prev:hover:before,
.slick-prev:focus:before,
.slick-next:hover:before,
.slick-next:focus:before {
  opacity: 1;
}
.slick-prev.slick-disabled:before,
.slick-next.slick-disabled:before {
  opacity: 0.25;
}

.slick-prev:before,
.slick-next:before {
  font-family: 'slick';
  font-size: 20px;
  line-height: 1;

  opacity: 0.75;
  color: black;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.slick-prev {
  left: -25px;
}
[dir='rtl'] .slick-prev {
  right: -25px;
  left: auto;
}
.slick-prev:before {
  content: '←';
}
[dir='rtl'] .slick-prev:before {
  content: '→';
}

.slick-next {
  right: -25px;
}
[dir='rtl'] .slick-next {
  right: auto;
  left: -25px;
}
.slick-next:before {
  content: '→';
}
[dir='rtl'] .slick-next:before {
  content: '←';
}

/* Dots */
.slick-dotted.slick-slider {
  margin-bottom: 30px;
}

.slick-dots {
  position: absolute;
  bottom: -25px;

  display: block;

  width: 100%;
  padding: 0;
  margin: 0;

  list-style: none;

  text-align: center;
}
.slick-dots li {
  position: relative;

  display: inline-block;

  width: 20px;
  height: 20px;
  margin: 0 5px;
  padding: 0;

  cursor: pointer;
}
.slick-dots li button {
  font-size: 0;
  line-height: 0;

  display: block;

  width: 20px;
  height: 20px;
  padding: 5px;

  cursor: pointer;

  color: transparent;
  border: 0;
  outline: none;
  background: transparent;
}
.slick-dots li button:hover,
.slick-dots li button:focus {
  outline: none;
}
.slick-dots li button:hover:before,
.slick-dots li button:focus:before {
  opacity: 1;
}
.slick-dots li button:before {
  font-family: 'slick';
  font-size: 6px;
  line-height: 20px;

  position: absolute;
  top: 0;
  left: 0;

  width: 20px;
  height: 20px;

  content: '•';
  text-align: center;

  opacity: 0.25;
  color: black;

  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.slick-dots li.slick-active button:before {
  opacity: 0.75;
  color: black;
}


</style>

<style lang="sass">
.main
	margin-bottom: 30px

.thumbnails
	margin: 0 -5px
	width: calc(100% + 10px)

// Basic VueAgile styles
.agile
	&__nav-button
		background: transparent
		border: none
		color: #ccc
		cursor: pointer
		font-size: 24px
		transition-duration: .3s
	
		.thumbnails &
			position: absolute
			top: 50%
			transform: translateY(-50%)

			&--prev
				left: -45px
	
			&--next
				right: -45px

		&:hover
			color: #888

	&__dot
		margin: 0 10px

		button 
			background-color: #eee
			border: none
			border-radius: 50%
			cursor: pointer
			display: block
			height: 10px
			font-size: 0
			line-height: 0
			margin: 0
			padding: 0
			transition-duration: .3s
			width: 10px

		&--current,
		&:hover
			button
				background-color: #888

// Slides styles	
.slide
	align-items: center
	box-sizing: border-box
	color: #fff
	display: flex
	justify-content: center

	&--thumbniail
		cursor: pointer
		height: 100px
		padding: 0 5px
		transition: opacity .3s

		&:hover
			opacity: .75

	img
		height: 100%
		object-fit: cover
		object-position: center
		width: 100%
</style>
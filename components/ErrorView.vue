<script setup lang="ts">
import type {NuxtError} from "#app";

const {error, clearError} = defineProps<{
  error: Error | undefined
  clearError: () => void,
}>()

function handleError() {
  clearError()
}

console.error(error)

const e = ref<{statusCode: number; message: string}>()
if (isNuxtError(error)) {
  console.log('Got a nuxt error', {error, statusCode: error.statusCode})
  e.value = {
    statusCode: error.statusCode,
    message: error.message
  }
} else if (error !== undefined) {
  e.value = {
    statusCode: 500,
    message: error.message
  }
} else {
  e.value = {
    statusCode: 500,
    message: "Something went wrong"
  }
}

const dogs = [
  {
    title: "Charlie the Golden Retriever",
    attribution: "https://commons.wikimedia.org/wiki/File:Charlie_the_Golden_Retriever_surrounded_by_daisies.png",
    src: "/images/dogs/charlie.png"
  },
  {
    title: "German Shepherd with Doggles",
    attribution: "https://commons.wikimedia.org/wiki/File:German_Sheppard_w_doggles.jpg",
    src: "/images/dogs/doggles.png"
  },
  {
    title: "Siberian Husky",
    attribution: "https://commons.wikimedia.org/wiki/File:Siberian_husky1.JPG",
    src: "/images/dogs/husky.png"
  },
  {
    title: "Border Collie",
    attribution: "https://commons.wikimedia.org/wiki/File:Border_Collie.jpg",
    src: "/images/dogs/collie.png"
  },
]

var notFoundDog = ref<typeof dogs[0]>()
onMounted(() => {
  notFoundDog.value = dogs[Math.floor(Math.random() * dogs.length)]
})
</script>

<template>
  <v-app class="app">
    <v-container class="h-100 d-flex justify-center align-center">
      <v-main>
        <div class="d-flex justify-center align-center text-center">
          <v-card
              v-if="e.statusCode == 404"
              title="Page Not Found"
              max-width="600"
              elevation="16"
          >
            <template v-slot:text>
              <p class="mb-4">Looks like you have went to a page which does not exist. Sorry about that. Here is a cute
                picture of a dog to compensate.</p>
              <NuxtPicture
                  v-if="notFoundDog"
                  aria-labelledby="dog"
                  :src="notFoundDog.src"
                  formats="avif,webp"
                  sizes="sm:400px 200px"
              />
              <p v-if="notFoundDog" id="dog" aria-label="">
                {{ notFoundDog.title }}
                (<a :href="notFoundDog.attribution"
                    target="_blank"
                    rel="noopener noreferrer">Source</a>)
              </p>
            </template>

            <template v-slot:actions>
              <v-btn @click="handleError" text="Take me home"/>
            </template>
          </v-card>
          <v-card
              v-else-if="e.statusCode == 403"
              title="Forbidden"
              max-width="600"
              elevation="16"
          >
            <template v-slot:text>
              <p class="mb-4">Looks like you have went to a page which you are not supposed to. Bad dog!</p>
            </template>

            <template v-slot:actions>
              <v-btn @click="handleError" text="Take me home"/>
            </template>
          </v-card>
          <v-card
              v-else
              :title="e.message"
              max-width="600"
              elevation="16"
          >
            <template v-slot:actions>
              <v-btn @click="handleError" text="Take me home"/>
            </template>
          </v-card>
        </div>
      </v-main>
    </v-container>
  </v-app>
</template>

<style scoped>
.app {
  background-image: var(--v-app-background) !important;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
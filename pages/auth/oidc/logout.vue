<script setup lang="ts">
definePageMeta({
  title: `Logging Out`
})
useHead({
  title: `Logging Out`
})

const oidc = useOidcAuth()
await oidc.logout()
</script>

<template>
  <VMain>
    <VContainer>
      <VCard>
        <VCardTitle>Logging out...</VCardTitle>
        <VCardText class="text-center">
          <strong>Please wait while we log you out.</strong>
          <br>
          <VProgressCircular
                             class="mt-4"
                             indeterminate
                             color="primary"
                             size="60"
                             width="10"
          />
        </VCardText>
      </VCard>
    </VContainer>
  </VMain>
</template>

<style scoped>

</style>
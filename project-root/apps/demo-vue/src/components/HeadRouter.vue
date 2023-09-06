<script setup lang="ts">
import { ref } from 'vue';
const navigation: { name: string; href: string }[] = [
{
    name: 'Home',
    href: '/',
  },
  {
    name: 'About',
    href: '/about',
  },
]

const tab = ref('Home')
</script>

<template>
  <q-tabs v-model="tab" >
    <q-route-tab v-for="link in navigation"
      :key="link.name"
      :to="link.href"
      :name="link.name"
      :label="link.name"
      exact
    />
  </q-tabs>
</template>

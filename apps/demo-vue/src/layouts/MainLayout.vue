<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <p class="vertical-middle">
            ERC3643 by <img src="@/assets/tokeny.png" width="150" alt="">
          </p>
        </q-toolbar-title>
        <q-space />
        <div class="q-gutter-sm row items-center no-wrap">
          <AccountConnect />
          <q-btn round dense flat color="white" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
            @click="$q.fullscreen.toggle()" v-if="$q.screen.gt.sm">
          </q-btn>
        </div>
      </q-toolbar>
      <HeadRouter />
    </q-header>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import HeadRouter from '@/components/HeadRouter.vue';
import AccountConnect from '@/components/AccountConnect.vue';

const $q = useQuasar();

</script>

<style>
/* FONT AWESOME GENERIC BEAT */
.fa-beat {
  animation: fa-beat 5s ease infinite;
}

@keyframes fa-beat {
  0% {
    transform: scale(1);
  }

  5% {
    transform: scale(1.25);
  }

  20% {
    transform: scale(1);
  }

  30% {
    transform: scale(1);
  }

  35% {
    transform: scale(1.25);
  }

  50% {
    transform: scale(1);
  }

  55% {
    transform: scale(1.25);
  }

  70% {
    transform: scale(1);
  }
}
</style>

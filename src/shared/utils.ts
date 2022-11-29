import {computed} from 'vue';

export const dateTransform = computed(() => (date: string) =>
  `${new Date(date).toISOString().slice(0, 10).replace(/-/g, '/')},
    ${new Date(date).toLocaleString('ru').slice(11, 20)}`)

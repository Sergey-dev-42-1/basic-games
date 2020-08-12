<template>
     <div @click="$emit('move')" class="cell">
      <span v-if="value !== ''">{{ value }}</span>
    </div>
</template>

<script>
  export default {
    props: {
      value: String,
    },
  }
 
</script>
<style>
  .cell {
    width: 6vw;
    height: 6vw;
    border: 0.25vw solid rgb(75,75,75);
    font-size: medium;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
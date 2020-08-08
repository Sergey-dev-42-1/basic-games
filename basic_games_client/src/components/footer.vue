<template>
<html>
<head></head>
<body>
 <v-footer 

 class="grey darken-2 py-4">
    <v-row id="customFooter"
    no-gutters
    justify='center'
    
    >
    <v-col
    align='center' 
    cols="12"
    class="white--text">
    {{ new Date().getFullYear() }} –      
    <span class="red--text darken-4 font-weight-bold">BG</span>
    <span>ames</span>
    </v-col>
    </v-row>
 </v-footer>
</body>
</html>
</template>

<script>

export default {
  name: 'customFooter',
}
</script>

<style scoped>
html{
  overflow: hidden;
}
</style>
<template>
<html>
<head title="Basic-games"></head>
<body>
    <div id ='app'>
    <registration></registration>
    </div>
</body>
</html>
</template>

<script>
import registration from './components/Registration'
export default {
  name: 'app',
  components: {'registration' : registration}
}
</script>

<style>

</style>

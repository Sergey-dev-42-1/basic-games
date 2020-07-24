<template>
<html>
<head title="Template page"></head>
<body>
    <div>
      <h1>Template</h1>
    <router-link to="/about">About|</router-link>
    <router-link to="/register">Register</router-link>
    <router-view></router-view>
    </div>
</body>
</html>
</template>

<script>
export default {
  name: 'TextBlock',
}
</script>

<style scoped>

</style>
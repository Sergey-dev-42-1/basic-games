<template>
<html>
<head title="404"></head>
<body>
    <div >
    <h1>HTTP 404| Such page doesn't exist, you will be redirected shortly </h1>
    </div>
</body>
</html>
</template>

<script>
export default {
    mounted: function(){
        this.redirect() 
    },
    methods: {
        redirect: function () {
            window.setInterval(()=>{this.$router.push('/')},5000)
        }
    },
    
}
</script>

<style>
h1{
    align-self: center;
    justify-content: center;
}

</style>

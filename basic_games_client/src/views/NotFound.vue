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
    data(){
        return{
            redirectTimer: ""
        }
    },
    mounted: function(){
        this.redirect() 
    },
    methods: {
        redirect: function () {
           this.redirectTimer = window.setTimeout(()=>{this.$router.push('/')},5000)
        }
    },
    beforeRouteLeave(to,from,next){
        window.clearTimeout(this.redirectTimer)
        next(true)
    }, 
}
</script>

<style>
h1{
    align-self: center;
    justify-content: center;
}

</style>

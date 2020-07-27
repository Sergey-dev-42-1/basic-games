<template>
<html>
<head title="401"></head>
<body>
    <div >
    <h1>HTTP 401| Log in to access this page  </h1>
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
            window.setTimeout(()=>{this.$router.push('/login')},5000)
        }
    },
    
}
</script>

<style>
h1{
    position: absolute;
    align-self: center;
    justify-content: center;
}

</style>

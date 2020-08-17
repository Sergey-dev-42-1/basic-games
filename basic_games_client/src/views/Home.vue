<template>
  <div id="logo_div">
    <span id="logo_span"
      ><p id="logo1">B</p>
      <p id="logo2">G</p></span
    >
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
};
</script>
<style>
#logo1 {
  font-size: 96px;
  color: red;
}
#logo2 {
  font-size: 96px;
  color: white;
}
#logo_span {
  display: flex;
  flex-direction: row;
}
#logo_div {
  background-color: gray;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  width: 100vw;
  height: 100%;
}
</style>

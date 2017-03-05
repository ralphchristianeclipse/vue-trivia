<template>
    <div>
    <transition enter-active-class="animated zoomIn"
    leave-active-class="animated zoomOut" mode="out-in">
        <router-view></router-view>
 
    </transition>
</div>
</template>

<script>
    export default {
        name: "app",
    }
</script>

<style src='../../node_modules/vue-material/dist/vue-material.css'>

</style>
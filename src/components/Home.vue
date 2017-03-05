<template>

        <md-card style="height: 100vh;" md-with-hover @click.native="$router.push({name: 'trivias'})">
            <md-card-media style="margin: auto;">
                <md-image md-src="images/logo.png"></md-image>
            </md-card-media>
        </md-card>
        
</template>

<script>
    export default {
        name: "home",
    }
</script>
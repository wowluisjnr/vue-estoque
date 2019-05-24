<template>

    <b-container>    
        <b-row class="justify-content-center">
            <b-col md="10">
                <router-view></router-view>
            </b-col>
        </b-row>  		
    </b-container>

        
</template>

<script>

export default {
    name: 'Content'
}
</script>

<style>
.content {        
        background-color: #efefef;
        padding: 20px;
    }

</style>

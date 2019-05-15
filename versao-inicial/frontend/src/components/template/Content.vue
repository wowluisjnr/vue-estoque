<template>
<div class="content">
    <div class="container">
  		<div class="row justify-content-center">
			<div class="col-10">
                <router-view></router-view>
			</div>
  		</div>
    </div>
</div>
        
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

<template>
	<div id="app">
		<Header />
		
		<Content />
				
		<Footer />
	</div>
</template>

<script>
import Header from './components/template/Header.vue'
import Content from './components/template/Content.vue'
import Footer from './components/template/Footer.vue'

export default {
	name: "App",
	components: { Header, Content, Footer}
}
</script>

<style>
	* {
		font-family: "Lato", sans-serif;
	}

	body {
		margin: 0;
	}

	#app{
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;

		height: 100vh;
		
	}


</style>
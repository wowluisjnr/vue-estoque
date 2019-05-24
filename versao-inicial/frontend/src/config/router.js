import Vue from 'vue'
import VueRouter from 'vue-router'


import Medicament from '@/components/admPages/Medicament'
import CurrentInventory from '@/components/inventory/CurrentInventory'
import Movements from '@/components/admPages/Movements'


Vue.use(VueRouter)

const routes = [{
    name:'medicament',
    path:'/medicament',
    component: Medicament
}, {
    name:'currentInventory',
    path:'/',
    component: CurrentInventory
},{
    name:'movements',
    path:'/movements',
    component: Movements
}]

const router = new VueRouter({
    mode:'history',
    routes
})

export default router
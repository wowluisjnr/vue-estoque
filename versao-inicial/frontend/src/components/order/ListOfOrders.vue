<template>
    <b-card :title="'Pedido nº'+$route.params.id">
        <div class="my-3">
            <!-- <b-form-checkbox                
                id="checkbox-1"
                v-model="notShowZero"
                name="checkbox-1"
                value="true"
                unchecked-value="false">
                Mostrar somente os medicamentos que tem no estoque 
            </b-form-checkbox> -->
            <b-button variant="primary" @click="showZero">{{notShowZero ? "Mostrar todos" : "Mostrar somente os que tem no estoque"}}</b-button>
        </div>
        <div class="d-flex justify-content-between">
            <p class="m-0">UBS {{listObj[0] ? listObj[0].ubs : ''}} - Em Atendimento</p>
            <b-button size="sm" variant="success" @click="saveListOrder">Finalizar atendimento</b-button>                         
        </div>

    <b-table id="my-table" 
        hover striped bordered small 
        :items="listOfOrdersTable" 
        :fields="fields" 
        :busy="isBusy"
        :per-page="perPage" 
        :current-page="currentPage"
        > 
        <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
        </div>
        <template slot="quantitySupplied" slot-scope="data">            
            <b-form-input v-model="data.item.quantitySupplied"  size="sm" type="number" :state="validation(data.item)"  ></b-form-input>
            <!-- v-show="data.item.entry" @keyup.enter="mudar(data.item)" -->          
        </template>
    </b-table>
    
        <b-pagination v-model="currentPage"
            :total-rows="rows" :per-page="perPage"
            aria-controls="my-table"></b-pagination>
            <!-- v-if="listMedicament.length > perPage" -->
    </b-card>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'

export default {
    name:'ListOfOrders',
    data:function(){
        return {
            notShowZero: false,
            isBusy:true,
            perPage:15,
            currentPage: 1,
            listOfOrders:[],
            listOfOrdersTable:[],
            listObj:[],
            fields:[
                {key:'composition', label:'Medicamento', sortable: true},
                {key:'unity', label:'Unidade', sortable: true},
                {key:'quantityOrder', label:'Quantidade Pedida'},
                {key:'quantitySupplied', label:'Quantidade Atendida'},
                {key: 'quantity', label:'Em estoque', sortable: true}                

            ]
        }
    },
    computed:{
        rows(){
            return this.listOfOrdersTable.length
        }
    },
    methods:{
        loadListOfOrders(){
            const url = `${baseApiUrl}/order/${this.$route.params.id}`
            axios.get(url).then(res => {
                this.listOfOrders = res.data.orders//.map(obj => obj = {...obj, entry:true})
                this.listOfOrdersTable = res.data.orders 
                this.listObj = res.data.list
            }).then( () => this.isBusy = false)
            //quantitySupplied
        },
        saveListOrder(){
            //console.log(this.listOfOrdersTable)
        },
        showZero(){
            //console.log(this.listOfOrders)
            if(!this.notShowZero)         
                this.listOfOrdersTable = this.listOfOrders.filter(obj => {    
                    return obj.quantity !== 0                
                })
            else
                this.listOfOrdersTable = this.listOfOrders

            this.notShowZero = !this.notShowZero   
        },
        validation(item) {
            //console.log(item.quantity)//verifica todos os itens? pq?
            return parseInt(item.quantitySupplied) ? (parseInt(item.quantitySupplied) <= parseInt(item.quantity)) : null 
        }
    },
    mounted(){
        this.loadListOfOrders()
    }

}
</script>

<style>

</style>

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
        hover striped bordered 
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
        <template slot="quantity" slot-scope="data">
            {{data.item.quantityTotal ? data.item.quantityTotal : data.item.quantity}}
        </template>
        <template slot="quantitySupplied" slot-scope="data">            
            <b-form-input v-if="!data.item.lotes" v-model="data.item.quantitySupplied"  size="sm" type="number" :state="validation(data.item)"  ></b-form-input>
            <span v-if="data.item.lotes">{{soma(data.item)}}</span>
            <!-- v-show="data.item.entry" @keyup.enter="mudar(data.item)" -->          
        </template>
        <template v-if="lotes.item.lotes" slot="row-details" slot-scope="lotes">
            <b-table small :items="lotes.item.lotes" :fields="fieldsLote">
                <template slot="quantitySupplied" slot-scope="data">            
                    <b-form-input v-model="data.item.quantitySupplied"  size="sm" type="number" :state="validation(data.item)"  ></b-form-input>
                    <!-- v-show="data.item.entry" @keyup.enter="mudar(data.item)" -->          
                </template>

            </b-table>
        </template>
    </b-table>
    
        <b-pagination v-model="currentPage"
            :total-rows="rows" :per-page="perPage"
            aria-controls="my-table"></b-pagination>
            <!-- v-if="listMedicament.length > perPage" -->
    </b-card>
</template>

<script>
import { baseApiUrl, dateFormat, showError } from '@/global'
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

            ],
            fieldsLote:[
                {key:'lotNumber', label:'Lote'},
                {key:'expirationDate', label:'Data de validade', sortable: true},
                {key:'quantitySupplied', label:'Quantidade Atendida'},
                {key: 'quantity', label:'Em estoque'}   
            ]
        }
    },
    computed:{
        rows(){
            return this.listOfOrdersTable.length
        }
    },
    methods:{
        soma(item){
            const total = item.lotes.reduce((total, obj) =>{
                return total + (obj.quantitySupplied ? parseInt(obj.quantitySupplied) : '')
            },0)
            item.quantitySuppliedTotal = total
            return total
        },
        loadListOfOrders(){
            const url = `${baseApiUrl}/order/${this.$route.params.id}`
            axios.get(url).then(res => {
                //this.listOfOrders = res.data[0]//.map(obj => obj = {...obj, entry:true})
                //console.log(res.data[0])
                const listNoReapeat = res.data[0].filter((obj, i, array) => {
                    if(i > 0){
                        if(obj.medicamentId !== array[i-1].medicamentId){
                            return true                            
                        }
                    } else if(i == 0) {
                        return true
                    }
                    return false                                  
                })

                this.listOfOrdersTable = listNoReapeat.map(obj =>{
                    obj.cont = 0
                    res.data[0].map(valor => {
                        if(obj.medicamentId === valor.medicamentId){
                            obj.cont++
                            if(obj.cont>1){  
                                if(!obj.lotes){
                                    obj.lotes = []
                                    obj.quantityTotal = 0
                                    obj.quantityTotal += obj.quantity
                                    obj.lotes.push({loteId:obj.loteId, lotNumber:obj.lotNumber, expirationDate:dateFormat(obj.expirationDate), quantitySupplied: obj.quantitySupplied, quantity: obj.quantity})
                                    obj._showDetails = true
                                    obj.expirationDate = dateFormat(obj.expirationDate)
                                    obj._rowVariant = 'success'
                                }  
                                //console.log(obj.quantityTotal,"+=", valor.quantity)                              
                                obj.quantityTotal += valor.quantity
                                valor.expirationDate = dateFormat(valor.expirationDate)
                                obj.lotes.push({loteId:valor.loteId, lotNumber: valor.lotNumber, expirationDate: valor.expirationDate, quantitySupplied: valor.quantitySupplied, quantity: valor.quantity})
                            } 
                        }
                    })
                    //console.log(obj)
                    return obj
                })
                
                this.listOfOrders = this.listOfOrdersTable
                this.listObj= res.data[1]

            }).then( () => this.isBusy = false)
            //quantitySupplied
        },
        saveListOrder(){
            const url = `${baseApiUrl}/order/${this.listObj[0].id}`
            // this.listOfOrdersTable.forEach(obj => {
            //     obj.quantitySuppliedTotal = soma()
            // })
            axios.post(url, this.listOfOrdersTable)
            .then(()=>{
                    //console.log(this.listMedicament)
                    // this.listMedicament = []
                    // this.medicaments.forEach( obj => obj.disabled = false)
                    // this.$bvModal.hide('modal-1')
                    this.$toasted.global.defaultSuccess()
                    this.$router.push({name: 'ordersReceived'})                    
                    // this.reset()
                })
                .catch(showError)
            //console.log(this.listOfOrdersTable, " - ", this.listOfOrders)
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

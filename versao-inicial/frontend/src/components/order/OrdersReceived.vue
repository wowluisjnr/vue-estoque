<template>
    <b-card  title="Pedidos recebidos">
        
        <b-table id="my-table" 
            hover striped bordered small 
            :items="listsOfOrders" 
            :fields="fields" 
            :busy="isBusy"
            > 
            <div slot="table-busy" class="text-center text-danger my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong>Loading...</strong>
            </div>
            <template slot="orderDate" slot-scope="data">
                {{ changeShowDate(data.item.orderDate) }}
            </template>
            <template slot="actions" slot-scope="data">
                <a :href="'/ordersreceived/'+data.item.id">
                <b-button size="sm" variant="info"  >
                     <i class="fa fa-eye"></i>                  
                </b-button>
                </a>  
            </template>
        </b-table>
        

        <!-- <b-button @click="toggleBusy">Toggle Busy State</b-button>

        <b-table :items="listsOfOrders" :busy="isBusy" class="mt-3" outlined>
        <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
        </div>
        </b-table> -->

    </b-card>
</template>

<script>
import { baseApiUrl, dateFormat } from '@/global'
import axios from 'axios'

export default {
    name: 'OrdersReceived',
    data: function(){
        return{
            isBusy: true,
            itemsTable:[],
            fieldTable:[],
            listsOfOrders:[],
            fields:[                
                { key: 'orderDate', label: 'Data do pedido', sortable: true },
                { key: 'ubs', label: 'Para unidade', sortable: true },
                { key: 'status', label: 'Status', sortable:true},
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods:{
        loadOrders(){            
            const url = `${baseApiUrl}/order`
            axios.get(url).then(res => {
                this.listsOfOrders = res.data 
            }).then( () => this.isBusy = false)

        },
        changeShowDate(item){
            return item ? dateFormat(item) : ''
        },
        
    },
    
    mounted(){
        this.loadOrders()
    }

}
</script>

<style>

</style>

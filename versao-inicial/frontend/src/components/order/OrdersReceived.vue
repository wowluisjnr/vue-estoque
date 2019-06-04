<template>
    <b-card  title="Pedidos recebidos">
        
        <b-table id="my-table" 
            hover striped bordered small 
            :items="listsOfOrders" 
            :fields="fields" 
            >                

            <template slot="actions" slot-scope="data">
                
                <b-button size="sm" variant="default"  >
                    <i class="fa fa-eye" ></i>                    
                </b-button>
            </template>
        </b-table>

    </b-card>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'OrdersReceived',
    data: function(){
        return{
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
            })            
        }
        
    },
    mounted(){
        this.loadOrders()
    }

}
</script>

<style>

</style>

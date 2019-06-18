<template>
<b-card title="Movimentações">     

        <div slot="header" class="d-flex justify-content-between">
            <div>
                <h4  class="mb-0">Movimentações</h4>               
            </div>
            <button type="button" class="btn btn-primary">Filtro com select aqui </button>
        </div>

        <b-table hover striped bordered :items="movimentations" :fields="fieldsMov">
            <template slot="show_details" slot-scope="row">
                <b-button size="sm" @click="row.toggleDetails(); selecteDet(row);">
                    {{ row.detailsShowing ? 'Esconder' : 'Mostrar'}} Detalhes
                </b-button>
            </template>
            <template slot="movementDate" slot-scope="data">
                {{showDate(data.item.movementDate)}}
            </template>
            <template slot="isEntry" slot-scope="data">
                <b-badge :variant="data.item.isEntry ? 'success' : 'warning'">{{data.item.isEntry ? 'Entrada' : 'Saída'}}</b-badge>
            </template>

            <template slot="row-details" slot-scope="row">
                <b-table small :items="row.item.medicaments" :fields="fieldsShow">
                    <template slot="expirationDate" slot-scope="data">
                        {{showDate(data.item.expirationDate)}}
                    </template>
                    <template slot="actions" slot-scope="data">
                        <b-button variant="warning" class="mr-2" >
                            <i class="fa fa-pencil"></i>
                        </b-button>
                        <b-button variant="danger" class="mr-2">
                            <i class="fa fa-trash"></i>
                        </b-button>

                    </template>
                </b-table>
            </template>
                       
        </b-table>
    </b-card>
    
</template>

<script>
import {baseApiUrl, dateFormat} from '@/global'
import axios from 'axios'


export default {
    name: 'Movements',
    data: function(){
        return {
            movimentations:[],
            fieldsMov:[                
                {key:'movementDate', label:'Data da Movimentação', sortable:true},
                {key:'isEntry', label:'Tipo', sortable:true},
                {key:'show_details', label:'Mostrar Detalhes'}                
            ],
            fieldsShow:[
                {key:'composition', label:'Medicamento', sortable:true},
                {key:'expirationDate', label:'Data de validade', sortable:true},
                {key:'quantity', label:'Quantidade', sortable:true},
                {key:'actions', label:'Ações'}
            ]
        }
    },
    methods:{
        selecteDet(row){
            row.item._rowVariant  = row.detailsShowing ? '' : 'success'          
        },
        loadMovements(){
            axios.get(`${baseApiUrl}/movements`).then(res =>{
                //console.log(res.data)
                //let movementations = []
                this.movimentations = res.data.filter((movement, i, array) => {
                    //console.log(movement)
                    if(!movement.repeat){
                        movement.medicaments = []
                        array.map(obj => {
                            if(movement.movementDate == obj.movementDate && movement.isEntry == obj.isEntry){
                                movement.medicaments.push({
                                    movementId: obj.id,
                                    id:obj.medicamentId, 
                                    composition: obj.composition, 
                                    expirationDate:obj.expirationDate,
                                    quantity:obj.quantity
                                })
                                obj.repeat = true                                
                            }
                        })
                        return movement
                    }
                })
                //console.log(teste)
            })
        },
        showDate(date){
            return dateFormat(date)
        }
    },
    mounted(){
        this.loadMovements()
    }

}
</script>

<style>

</style>

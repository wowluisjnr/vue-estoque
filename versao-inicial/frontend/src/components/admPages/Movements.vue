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

            <template slot="row-details" slot-scope="row">
                <b-table small :items="row.item.medicaments" :fields="fieldsShow"></b-table>
            </template>
                       
        </b-table>
    </b-card>
    
</template>

<script>
export default {
    name: 'Movements',
    data: function(){
        return {
            movimentations:[
                {isEntry:true, movimentDate:'10/10/2018', medicaments:[
                    {composition: "Teste", quantity:100, expirationDate:'10/10/2021'},
                    {composition: "Teste 2", quantity:200, expirationDate:'10/10/2021'}]
                },
                {isEntry:false, movimentDate:'10/12/2019', medicaments:[
                    {composition: "Saida teste", quantity:50, expirationDate:'10/10/2021'},
                    {composition: "Saida 2", quantity:100, expirationDate:'10/10/2021'}
                ]}
            ],
            fieldsMov:[                
                {key:'movimentDate', label:'Data da Movimentação', sortable:true},
                {key:'isEntry', label:'Tipo', sortable:true},
                {key:'show_details', label:'Mostrar Detalhes'}                
            ],
            fieldsShow:[
                {key:'composition', label:'Medicamento', sortable:true},
                {key:'expirationDate', label:'Data de validade', sortable:true},
                {key:'quantity', label:'Quantidade', sortable:true}
            ]
        }
    },
    methods:{
        selecteDet(row){
            row.item._rowVariant  = row.detailsShowing ? '' : 'success'          
        }
    }

}
</script>

<style>

</style>

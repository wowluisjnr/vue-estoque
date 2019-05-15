<template>
    <b-card title="Estoque" sub-title="Estoque Atual">
        <b-table hover striped :items="inventory" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" >
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
    </b-card>
</template>

<script>
export default {
    name:'CurrentInventory',
    data:function(){
        return {
            inventory:[
                {id:1, name: 'Losartana 50mg', und: 'CP',expirationDate:'10/10/2019', qtd: 960},
                {id:2, name: 'Losartana 25mg', und: 'CP',expirationDate:'10/10/2019', qtd: 1000},
                {id:3, name: 'Anlodipino 5mg', und: 'CP',expirationDate:'10/10/2019', qtd: 500},
                {id:4, name: 'Ibuprofeno', und: 'GTS',expirationDate:'10/10/2019', qtd: 40}
            ],
            fields: [                
                { key: 'name', label: 'Medicamento', sortable: true },
                { key: 'und', label: 'Unidade', sortable: true },
                { key: 'expirationDate', label: 'Data de validade', sortable:true},
                { key: 'qtd', label: 'Quantidade', sortable:true},
                { key: 'actions', label: 'Ações' }
            ]
        }
    }

}
</script>

<style>

</style>

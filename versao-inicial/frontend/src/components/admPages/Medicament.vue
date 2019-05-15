<template>
    <b-card  title="Medicamentos" sub-title="Gerenciar Medicamentos">
        <b-form>
            <!-- <input id="category-id" type="hidden" v-model="category.id" /> -->
            <b-form-group label="Composição:" label-for="medicamento-name">
                <b-form-input id="medicamento-name" type="text"                   
                    placeholder="Informe a composição do Medicamento..." />
            </b-form-group>
            <b-form-group label="Unidade:" label-for="Medicamento-Unidade">
                <b-form-select                    
                    :options="unidades" />                
            </b-form-group>
            <b-button variant="primary" >Salvar</b-button>
            <b-button variant="danger" class="ml-2" >Excluir</b-button>
            <b-button class="ml-2" >Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="medicamentos" :fields="fields">
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
    name:'Medicament',
    data:function() {
       return{ 
            unidades:[
                {value: 'CP', text: 'Comprimido - CP'},
                {value: 'FR', text: 'Frasco -FR'},
                {value: 'GTS', text: ' Gota - GTSs'},
                {value: 'AMP', text: 'Ampola - AMP'}
            ],
            medicamentos:[
                {id:1, name: 'Losartana 50mg', und: 'CP', estMin: 960},
                {id:2, name: 'Losartana 25mg', und: 'CP', estMin: 1000},
                {id:3, name: 'Anlodipino 5mg', und: 'CP', estMin: 500},
                {id:4, name: 'Ibuprofeno', und: 'GTS', estMin: 40}
            ],
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'name', label: 'Medicamento', sortable: true },
                { key: 'und', label: 'Unidade', sortable: true },
                { key: 'estMin', label: 'Estoque Minimo'},
                { key: 'actions', label: 'Ações' }
            ]
        }
    }

}
</script>

<style>

</style>

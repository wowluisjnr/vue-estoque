<template>
    <b-card :title="formShow ? 'Nova entrada':'Estoque atual'">

        <b-form v-if="formShow">
            <!-- <input id="user-id" type="hidden" v-model="user.id" /> -->
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Medicamento:" label-for="medicament-name">
                        <b-form-select id="medicament-name" type="text"  :options="medicaments"                          
                            placeholder="Informe a Composição do Medicamento..." />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Data de validade:" label-for="medicament-expire">
                        <b-form-input id="medicament-expire" type="date" />
                    </b-form-group>
                </b-col>
            </b-row>            
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Numero do Lote:" label-for="medicament-password">
                        <b-form-input id="medicament-" type="text"                            
                            placeholder="Informe o Lote do Medicamento..." />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Quantidade:" 
                        label-for="medicament-qtd">
                        <b-form-input id="medicament-qtd" type="number"                            
                            placeholder="Quantidade do Medicamento..." />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" @click="changeFormShow">Salvar</b-button>                    
                    <b-button class="ml-2" @click="changeFormShow">Cancelar</b-button>
                </b-col>
            </b-row>
            <hr>
        </b-form>


        <div slot="header" class="d-flex justify-content-between">
            <div>
                <h4  class="mb-0">Estoque</h4>               
            </div>
            <button :disabled="formShow" type="button" class="btn btn-primary" @click="changeFormShow">Nova Entrada</button>
        </div>

        <b-table hover striped :items="inventory" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button v-b-tooltip.hover title="Nova entrada" variant="primary" class="mr-2">
                    <i class="fa fa-plus"></i>
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
            medicaments:[
                {value:1, text: 'Losartana 50mg - CP'},
                {value:2, text: 'Losartana 25mg - CP'},
                {value:3, text: 'Captopril 50mg - CP'},
                {value:4, text: 'Ibuprofeno 50mg - GTS'}
            ],
            fields: [                
                { key: 'name', label: 'Medicamento', sortable: true },
                { key: 'und', label: 'Unidade', sortable: true },
                { key: 'expirationDate', label: 'Data de validade', sortable:true},
                { key: 'qtd', label: 'Quantidade', sortable:true},
                { key: 'actions', label: 'Ações' }
            ],
            formShow: false
        }
    },
    methods: {
        changeFormShow(){
            this.formShow = !this.formShow
        }
    }

}
</script>

<style>

</style>

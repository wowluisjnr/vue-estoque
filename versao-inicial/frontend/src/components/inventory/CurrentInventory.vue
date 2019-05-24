<template>
    <b-card :title="formShow ? 'Nova entrada':'Estoque atual'">

        <b-form v-if="formShow">
            <!-- <input id="user-id" type="hidden" v-model="user.id" /> -->
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Medicamento:" label-for="entry-name">
                        <b-form-select id="entry-name" type="text"  :options="medicaments"                          
                            v-model="entry.medicamentId"
                            placeholder="Informe a Composição do Medicamento..." />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Data de validade:" label-for="entry-expirationDate">
                        <b-form-input id="entry-expirationDate" type="date" 
                            v-model="entry.expirationDate" />
                    </b-form-group>
                </b-col>
            </b-row>            
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Numero do Lote:" label-for="entry-lote">
                        <b-form-input id="entry-lote" type="text"                            
                            placeholder="Informe o Lote do Medicamento..." 
                            v-model="entry.lotNumber"/>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Quantidade:" 
                        label-for="entry-quantity">
                        <b-form-input id="entry-quantity" type="number"                            
                            placeholder="Quantidade do Medicamento..."
                            v-model="entry.quantity" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col xs="12">
                    <b-button variant="primary" @click="newEntry">Salvar</b-button>                    
                    <b-button class="ml-2" @click="reset">Cancelar</b-button>
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

        <b-table hover striped bordered :items="inventory" :fields="fields">
            <!-- <template slot="actions" slot-scope="data">
                <b-button v-b-tooltip.hover title="Nova entrada" variant="primary" class="mr-2">
                    <i class="fa fa-plus"></i>
                </b-button>
            </template> -->
        </b-table>
    </b-card>
</template>

<script>
import { baseApiUrl, dateFormat } from '@/global'
import axios from 'axios'

export default {
    name:'CurrentInventory',
    data:function(){
        return {
            inventory:[],
            medicaments:[],
            fields: [                
                { key: 'composition', label: 'Medicamento', sortable: true },
                { key: 'unity', label: 'Unidade', sortable: true },
                { key: 'expirationDate', label: 'Data de validade', sortable:true},
                { key: 'quantity', label: 'Quantidade', sortable:true},
                //{ key: 'actions', label: 'Ações' }
            ],
            entry:{},
            //lote:{},
            formShow: false
        }
    },
    methods: {
        getInventory(){
            const url = `${baseApiUrl}/inventory`
            axios.get(url).then(res => {
                this.inventory = res.data.map(obj => {
                    if(!obj.quantity){
                        obj ={...obj, _rowVariant: 'danger'}
                    }
                    return obj                    
                })
                res.data.map( medicament => {
                    this.medicaments.push({
                        id:medicament.id,
                        composition: medicament.composition,
                        unity: medicament.unity,
                        value: medicament.id,
                        text: `${medicament.composition} - ${medicament.unity}`
                        
                    })
                })
            })
        },
        reset() {
            //this.mode = 'save'
            this.entry = {}
            this.changeFormShow()
            this.getInventory()
        },
        newEntry(){
            const url = `${baseApiUrl}/entries`
            this.entry.expirationDate = dateFormat(this.entry.expirationDate)
            axios.post(url, this.entry)
                .then(()=>{
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
        },
        rowClass(item){
            if(!item) return
            if(!item.quantity) return 'table-danger'            
        },
        changeFormShow(){
            this.formShow = !this.formShow
        }
    },
    mounted(){
        this.getInventory()
    }

}
</script>

<style>

</style>

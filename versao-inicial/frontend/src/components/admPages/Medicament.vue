<template>
    <b-card  title="Medicamentos" sub-title="Gerenciar Medicamentos">
        <b-form>
            <input id="medicament-id" type="hidden" v-model="medicament.id" />
            <b-form-group label="Composição:" label-for="medicamento-composition">
                <b-form-input id="medicamento-composition" type="text" 
                    v-model="medicament.composition" required                
                    placeholder="Informe a composição do Medicamento..." />
            </b-form-group>
            <b-form-group label="Unidade:" label-for="Medicamento-Unidade">
                <b-form-select                    
                    :options="unidades" v-model="medicament.unity"/>                
            </b-form-group>
            <b-form-group label="Estoque Minimo:" label-for="medicamento-minimumStock">
                <b-form-input id="medicamento-minimumStock" type="number" 
                    v-model="medicament.minimumStock" required                
                    placeholder="Informe o estoque minimo para emissão de alerta..." />
            </b-form-group>
            <b-button variant="primary" @click="save">Salvar</b-button>
            <!-- <b-button variant="danger" class="ml-2" >Excluir</b-button> -->
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped bordered small :items="medicaments" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" class="mr-2" @click="loadMedicament(data.item)">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <!-- <b-button variant="danger" >
                    <i class="fa fa-trash"></i>
                </b-button> -->
            </template>
        </b-table>
    </b-card>
</template>

<script>
import axios from 'axios'
import { baseApiUrl, showError } from '@/global'

export default {
    name:'Medicament',
    data:function() {
       return{ 
            unidades:[
                {value: 'CP', text: 'Comprimido - CP'},
                {value: 'FR', text: 'Frasco -FR'},
                {value: 'GTS', text: ' Gota - GTS'},
                {value: 'AMP', text: 'Ampola - AMP'}
            ],
            medicaments:[],
            medicament:{},
            fields: [
                { key: 'id', label: 'Código', sortable: true },
                { key: 'composition', label: 'Medicamento', sortable: true },
                { key: 'unity', label: 'Unidade', sortable: true },
                { key: 'minimumStock', label: 'Estoque Minimo', sortable: true},
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods:{
        loadMedicaments(){            
            const url = `${baseApiUrl}/medicaments`
            axios.get(url).then(res => {
                this.medicaments=res.data                
            })
        },
        loadMedicament(medicament){
            this.medicament = {...medicament}            
        },
        reset(){
            this.medicament = {}
            this.loadMedicaments()
        },
        save(){
            const method = this.medicament.id ? 'put' : 'post'
            const id = this.medicament.id ? `/${this.medicament.id}` : ''
            axios[method](`${baseApiUrl}/medicaments${id}`, this.medicament)
                .then(()=>{
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(showError)           
        }
    },
    mounted(){
        this.loadMedicaments()
    }
    

}
</script>

<style>

</style>

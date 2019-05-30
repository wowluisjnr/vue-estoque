<template>
    <b-card  title="Pedidos" sub-title="Novo Pedido">
        <b-form @keyup.enter="addMedToList">
            <b-row>
                <b-col md="8" sm="12">            
                    <b-form-group label="Medicamento:" label-for="medicamento-composition"> 
                                
                        <b-form-input id="medicament" list="my-list-id" placeholder="Informe o Medicamento..." v-model="medicament.composition"></b-form-input>
                        <datalist id="my-list-id" >                            
                            <option v-for="med in medicaments" :key="med.id" 
                            :value="med.composition" :disabled="med.disabled">{{ med.unity }}  </option>
                        </datalist>
                    </b-form-group>
                </b-col>
            
                <b-col md="4" sm="12">            
                    <b-form-group label="Quantidade:" label-for="medicamento-quantity">
                        <b-form-input id="medicamento-quantity" type="number" 
                            v-model="medicament.quantity"                                   
                            placeholder="Quantidade do pedido..." />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-button variant="primary" @click="addMedToList">Adicionar</b-button>
            <!-- <b-button variant="danger" class="ml-2" >Excluir</b-button> -->
            <!-- <b-button class="ml-2" >Cancelar</b-button> -->
        </b-form>
        <hr>
        <b-table hover striped bordered small :items="listMedicament" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button size="sm" variant="warning" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button size="sm" variant="danger" >
                    <i class="fa fa-trash" ></i>                    
                </b-button>
            </template>
        </b-table>
    </b-card>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'


export default {
    name: 'Order',
    data: function(){
        return {
            medicament:{},
            medicaments: [],
            listMedicament:[],
            fields: [                
                { key: 'composition', label: 'Medicamento', sortable: true },
                { key: 'unity', label: 'Unidade', sortable: true },
                { key: 'quantity', label: 'Quantidade', sortable:true},
                { key: 'actions', label: 'Ações' }
            ]
        }
    },
    methods:{
        loadMedicaments(){            
            const url = `${baseApiUrl}/medicaments`
            axios.get(url).then(res => {
                this.medicaments = res.data 
            })            
        },
        reset(){
            document.getElementById("medicament").focus()
            this.medicament = {}
        },
        addMedToList(){
            //FALTA VALIDAR DADOS            
            const medicament = this.medicaments.filter(obj =>{
                if(obj.composition === this.medicament.composition){
                    obj.disabled = true
                    return true
                }                
                return false
            })

            if(!this.medicament.quantity){
                this.$toasted.show("Quantidade não fornecida", { type:'error', icon:'times'})
            }else if(!medicament[0]){   
                this.$toasted.show("Medicamento informado não consta na lista", { type:'error', icon:'times'})
            }else {                         
                this.medicament = {...this.medicament, id: medicament[0].id, unity:medicament[0].unity}
                this.listMedicament.push(this.medicament)
                this.reset()
                this.$toasted.global.defaultSuccess()
            }
        }
        
    },
    mounted(){
        this.loadMedicaments()
    }

}
</script>

<style>


</style>

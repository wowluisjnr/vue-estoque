<template>
    <b-card  title="Novo Pedido de Medicamentos">
        <b-form @keyup.enter="addMedToList">
            <b-row>
                <b-col md="8" sm="12">            
                    <b-form-group label="Medicamento:" label-for="medicamento-composition"> 
                                
                        <b-form-input id="medicament" list="my-list-id" placeholder="Informe o Medicamento..." v-model="medicament.composition"></b-form-input>
                        <datalist id="my-list-id" >                            
                            <option v-for="med in medicaments" :key="med.id" 
                            :value="med.composition" :disabled="med.disabled">{{ med.unity  }}  </option>
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
        <div>

            <b-row>
                <b-col md="5" class="my-1">
                    <b-form-group label-cols-sm="3" label="Filtrar" class="mb-0">
                        <b-input-group>
                            <b-form-input v-model="filter" placeholder="Pesquisar"></b-form-input>
                            <b-input-group-append>
                            <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
                            </b-input-group-append>
                        </b-input-group>
                    </b-form-group>
                </b-col>
                <b-col md="7" class="my-1">
                    <b-form-group label-cols-sm="3" label="Medicamentos por página" class="mb-0">
                    <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" class="my-1">
                    <p class="m-0">Lista de Medicamentos</p>  
                </b-col>
                <b-col md="6" class="my-1">
                    <div class="d-flex flex-row-reverse">
                        <b-button :disabled="!listMedicament.length" size="sm" variant="success" @click="showMsgBoxTwo">Enviar Pedido</b-button> 
                        <div>                            
                            <b-modal id="modal-1" 
                            ref="modal"
                            title="Aguarde..."
                            size="sm"
                            hide-footer                       
                            footerClass="p-2"
                            centered >
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>  Enviando pedido... </strong>                                
                            </b-modal>
                        </div>
                    </div>                   
                </b-col>
            </b-row>     
          

            <b-table id="my-table" 
                    hover striped bordered small 
                    :items="listMedicament" 
                    :fields="fields" 
                    :per-page="perPage" 
                    :filter="filter"
                    :current-page="currentPage"
                    @filtered="onFiltered" >                

                <template slot="actions" slot-scope="data">
                   
                    <b-button size="sm" variant="danger"  @click="removeToItemList(data.item)" >
                        <i class="fa fa-trash" ></i>                    
                    </b-button>
                </template>
            </b-table>

            <b-pagination v-if="listMedicament.length > perPage" v-model="currentPage"
                :total-rows="rows" :per-page="perPage"
                aria-controls="my-table"></b-pagination>
           
        </div>
    </b-card>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'


export default {
    name: 'Order',
    data: function(){
        return {
            perPage:10,
            pageOptions:[3, 10, 15, 20],
            currentPage: 1,
            filter:'',
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
    computed:{
        rows(){
            return !this.filter ? this.listMedicament.length : this.totalRows
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
            if(!medicament[0]){   
                this.$toasted.show("Medicamento informado não consta na lista", { type:'error', icon:'times'})
            } else if(!this.medicament.quantity){
                this.$toasted.show("Quantidade não fornecida", { type:'error', icon:'times'})
            } else {                         
                this.medicament = {...this.medicament, id: medicament[0].id, unity:medicament[0].unity}
                this.listMedicament.push(this.medicament)
                this.reset()
                this.$toasted.global.defaultSuccess()
            }
        },
        removeToItemList(item){
            this.medicaments.forEach(obj => {
                if(item.id === obj.id) obj.disabled = false
            })     
            
            this.listMedicament.splice(this.listMedicament.indexOf(item), 1)
            
            this.$toasted.show(`${item.composition} foi removido da lista`, { type:'error', icon:'times'})                 
           
        },        
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering            
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        saveOrder(){
            axios.post(`${baseApiUrl}/order`, this.listMedicament)
            .then(()=>{
                    //console.log(this.listMedicament)
                    this.listMedicament = []
                    this.medicaments.forEach( obj => obj.disabled = false)
                    this.$bvModal.hide('modal-1')
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
        },
        showMsgBoxTwo() {
        this.$bvModal.msgBoxConfirm('Confirmar envio do pedido?', {
          title: 'Confirmação',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'Confirmar',
          cancelTitle: 'Cancelar',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true
        })
          .then(value => {
              if(value){
                  this.$bvModal.show('modal-1')
                  this.saveOrder()
              }            
          })
          .catch(err => {
            // An error occurred
            this.$toasted.show(`Ocorreu um erro ao enviar o Pedido! Erro ${err}`, { type:'error', icon:'times'})
          })
      }       
        
    },
    mounted(){
        this.loadMedicaments()
    }

}
</script>

<style>


</style>

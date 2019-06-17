<template>
    <b-card title="Entrada de medicamentos">
        <b-form>
            <!-- <input id="user-id" type="hidden" v-model="user.id" /> -->
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Medicamento:" label-for="entry-name">
                        <b-form-input list="input-list" id="entry-name" v-model="entry.composition" :state="nameState" ></b-form-input>
                        <b-form-datalist id="input-list" :options="medicaments"></b-form-datalist>
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
                        <b-form-input list="list-lote-number" v-model="entry.lotNumber" @focus="filterLotes(entry.composition)"></b-form-input>
                        <datalist id="list-lote-number" placeholder="Informe o Lote do Medicamento..." >                            
                            <option v-for="size in lotesNumber" :key="size.lotNumber">{{ size.lotNumber }}</option>
                        </datalist>
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
                    <b-button variant="primary" @click="addEntryToList">Adicionar</b-button>                    
                    <b-button class="ml-2">Cancelar</b-button>
                </b-col>
            </b-row>
            <hr>
        </b-form>


        <hr>
        <div>
            <b-row class="d-flex flex-row-reverse">
                <b-col md="5" class="my-1">
                    <b-form-group label-cols-sm="6" label="Linhas por página" class="mb-0">
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
                        <b-button :disabled="!listEntry.length" size="sm" variant="success" @click="showMsgBoxTwo">Enviar Pedido</b-button> 
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
                    :items="listEntry" 
                    :fields="fields" 
                    :per-page="perPage"                     
                    :current-page="currentPage"
                    >                

                <template slot="actions" slot-scope="data">
                   <b-button size="sm" variant="warning" class="mr-2" @click="loadEntry(data.item)" >
                        <i class="fa fa-pencil" ></i>                    
                    </b-button>
                    <b-button size="sm" variant="danger" @click="removeEntryList(data.item)">
                        <i class="fa fa-trash" ></i>                    
                    </b-button>
                </template>
            </b-table>

            <b-pagination v-if="listEntry.length > perPage" v-model="currentPage"
                :total-rows="rows" :per-page="perPage"
                aria-controls="my-table"></b-pagination>
           
        </div>
    </b-card>
    
</template>

<script>
import {baseApiUrl} from '@/global'
import axios from 'axios'

export default {
    name:'NewEntry',
    data:function(){
        return {
            perPage:10,
            pageOptions:[ 10, 15, 20],
            currentPage: 1,
            listEntry:[],
            medicaments:[],            
            fields: [                
                { key: 'composition', label: 'Medicamento', sortable: true },
                { key: 'unity', label: 'Unidade', sortable: true },
                { key: 'expirationDate', label: 'Data de validade', sortable:true},
                { key: 'quantity', label: 'Quantidade', sortable:true},
                { key: 'actions', label: 'Ações' }
            ],
            entry:{},
            lotesNumber:[],
            lotesNumberAll:[],
            formShow: false,
            nameState:null,
        }
    },
    methods:{
        loadMedicaments(){            
            const url = `${baseApiUrl}/medicaments`
            axios.get(url).then(res => {
                this.medicaments = res.data.map(medicament =>{
                    medicament.value = medicament.composition
                    medicament.text = medicament.unity
                    return medicament
                }) 
            })            
        },
        loadLotes(){
            const url =`${baseApiUrl}/lotes`
            axios.get(url).then( res => {
                this.lotesNumber = res.data
                this.lotesNumberAll = res.data
            })
        },
        reset(){
            document.getElementById("entry-name").focus()
            this.entry = {}
        },
        findMedicament(){
            const med = this.medicaments.filter(obj =>{
                if(obj.composition === this.entry.composition){
                    return true
                }                
                return false
            })  
            return med[0]          
        },
        addEntryToList(){
            const medicament = this.findMedicament()
            if(!medicament){   
                this.$toasted.show("Medicamento informado não esta cadastrado", { type:'error', icon:'times'})
                this.nameState = false
            } else {
                this.entry = {...this.entry, id:medicament.id, unity:medicament.unity}
                this.listEntry.push(this.entry)
                this.reset()
            }
        },
        removeEntryList(item){
            this.listEntry.splice(this.listEntry.indexOf(item), 1)            
            this.$toasted.show(`${item.composition} foi removido da lista`, { type:'error', icon:'times'})               
        },
        loadEntry(entry) {
            //this.mode = mode
            this.entry = { ...entry }
        },
        filterLotes(){
            const medicamentId = this.findMedicament()
            this.lotesNumber = medicamentId ? this.lotesNumberAll.filter(lote => lote.medicamentId == medicamentId.id) : []
            //console.log(this.lotesNumber)
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
                    //this.saveOrder()
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
        this.loadLotes()
    }

}
</script>

<style>

</style>

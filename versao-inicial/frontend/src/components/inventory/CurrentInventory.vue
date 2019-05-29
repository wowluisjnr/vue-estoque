<template>
    <b-card :title="formShow ? 'Nova entrada':'Estoque atual'">

        <b-form v-if="formShow">
            <!-- <input id="user-id" type="hidden" v-model="user.id" /> -->
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Medicamento:" label-for="entry-name">
                        
                            <b-form-select id="entry-name" type="text"  
                            :options="medicaments" 
                             v-model="entry.medicamentId"   
                             placeholder="Informe a Composição do Medicamento..."                        
                            />                            
                        <!-- </datalist> -->

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
                        <b-form-input list="my-list-id" v-model="entry.lotNumber"></b-form-input>
                        <datalist id="my-list-id" placeholder="Informe o Lote do Medicamento..." >                            
                            <option v-for="size in lotesNumber" :key="size.lotNumber">{{ size.lotNumber }}</option>
                        </datalist><!-- 
                        <b-form-input id="entry-lote" type="text"                            
                            placeholder="Informe o Lote do Medicamento..." 
                            v-model="entry.lotNumber"/> -->
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
import { baseApiUrl, dateFormat, showError } from '@/global'
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
            lotesNumber:[],
            formShow: false
        }
    },
    methods: {
        loadInventory(){
            const url = `${baseApiUrl}/inventory`
            axios.get(url).then(res => {
                
                this.inventory = res.data.map(obj => {
                    
                    // if(!obj.quantity){
                    //     t = array.findIndex((elem, j) =>{
                    //         return i !== j && elem.medicamentId === obj.medicamentId && elem.quantity
                    //     } )
                    //     if(t < 0 ){
                    //         this.inventory.push(obj)
                    //     } 
                    // } else {
                    //     this.inventory.push(obj)
                    // }  
                    
                    
                    if(!obj.quantity){
                        obj ={...obj, quantity:0 , _rowVariant: 'danger'}
                    } else if(obj.quantity<obj.minimumStock){
                        obj= {...obj, _rowVariant:'warning'}
                    }
                    return obj                    
                })
            })
        },
        loadMedicaments(){            
            const url = `${baseApiUrl}/medicaments`
            axios.get(url).then(res => {
                res.data.map( medicament =>
                    this.medicaments.push({
                        id:medicament.id,
                        composition: medicament.composition,
                        unity: medicament.unity,
                        value: medicament.id,
                        text: `${medicament.composition} - ${medicament.unity}`
                        
                    })    
                )           
            })
        },
        loadLotes(){
            const url =`${baseApiUrl}/lotes`
            axios.get(url).then( res => {
                this.lotesNumber = res.data
            })

        },
        reset() {
            //this.mode = 'save'
            this.entry = {}
            this.inventory =[]
            this.medicaments = []
            this.changeFormShow()
            this.loadInventory()
        },
        newEntry(){

            const indexLoteExist = this.inventory.findIndex(obj => obj.lotNumber === this.entry.lotNumber)

            const method = indexLoteExist >= 0 ? 'put' : 'post'
            const id = indexLoteExist >= 0 ? `/${this.inventory[indexLoteExist].loteId}`:''
            
            if(indexLoteExist >= 0){
                this.inventory[indexLoteExist].plusQuantity = parseInt(this.entry.quantity)                
            }

            if(this.entry.expirationDate) this.entry.expirationDate = dateFormat(this.entry.expirationDate)

            axios[method](`${baseApiUrl}/entries${id}`, indexLoteExist >= 0 ?  this.inventory[indexLoteExist] : this.entry )
                .then(()=>{
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)
            

            //const url = `${baseApiUrl}/entries`

            // if(this.entry.expirationDate) this.entry.expirationDate = dateFormat(this.entry.expirationDate)
            // axios.post(url, this.entry)
            //     .then(()=>{
            //         this.$toasted.global.defaultSuccess()
            //         this.reset()
            //     })
            //     .catch(showError)
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
        this.loadInventory()
        this.loadMedicaments()
        this.loadLotes()
    }

}
</script>

<style>

</style>

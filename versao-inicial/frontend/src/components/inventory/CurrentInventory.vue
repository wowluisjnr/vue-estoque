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
                    <b-button class="ml-2" @click="reset(); changeFormShow();">Cancelar</b-button>
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

        <b-table hover striped bordered :items="inventoryOfMed" :fields="fields">
            <template slot="expirationDate" slot-scope="data">
                {{ changeShowDate(data.item.expirationDate) }}                
            </template>
            
            <!--<template slot="actions" slot-scope="data">
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
            inventoryOfMed:[],
            medicaments:[],            
            fields: [                
                { key: 'composition', label: 'Medicamento', sortable: true },
                { key: 'unity', label: 'Unidade', sortable: true },
                //{ key: 'expirationDate', label: 'Data de validade', sortable:true},
                { key: 'sumQuant', label: 'Quantidade', sortable:true},
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
                    if(!obj.quantity){
                        obj ={...obj, quantity:0 , _rowVariant: 'danger'}
                    } else if(obj.quantity<obj.minimumStock){
                        obj= {...obj, _rowVariant:'warning'}
                    }
                    return obj                    
                })

                this.inventoryOfMed = this.inventory.filter((item, i, array) => {                    
                    item.sumQuant = 0
                    if(!item.dis)
                    {
                        array.map((obj)=> {
                            if((obj.medicamentId == item.medicamentId)){
                                item.sumQuant = item.sumQuant + obj.quantity
                                obj.dis = true                                
                            }
                        })
                        if(item.sumQuant>0)
                            item._rowVariant = item.sumQuant < item.minimumStock ? 'warning' : ''
                        else{
                            item._rowVariant = 'danger'
                        }
                        return item
                    }                     
                })
            })


        },
        loadMedicaments(){            
            const url = `${baseApiUrl}/medicaments`
            axios.get(url).then(res => {
                res.data.map( medicament =>
                    this.medicaments.push({
                        ...medicament,
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
            this.entry = {}
            this.inventory =[]
            this.medicaments = []
            this.lotesNumber =[]
            //this.changeFormShow()
            this.loadMedicaments()
            this.loadInventory()
            this.loadLotes()
        },
        newEntry(){

            const indexLoteExist = this.lotesNumber.findIndex(obj => obj.lotNumber === this.entry.lotNumber)

            const method = indexLoteExist >= 0 ? 'put' : 'post'
            const id = indexLoteExist >= 0 ? `/${this.lotesNumber[indexLoteExist].loteId}`:''
            
            if(indexLoteExist >= 0){
                this.lotesNumber[indexLoteExist].plusQuantity = parseInt(this.entry.quantity) //se quantity for 0???    
                if(!parseInt(this.entry.quantity)){
                    this.$toasted.show("Quantidade não informada!!", { 
                            type: "error", 
                            icon: "times"
                        });
                    return
                }           
            }

            //if(this.entry.expirationDate) this.entry.expirationDate = dateFormat(this.entry.expirationDate)

            axios[method](`${baseApiUrl}/entries${id}`, indexLoteExist >= 0 ?  this.lotesNumber[indexLoteExist] : this.entry )
                .then(()=>{
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                })
                .catch(showError)            
        },
        rowClass(item){
            if(!item) return
            if(!item.quantity) return 'table-danger'            
        },
        changeFormShow(){
            this.formShow = !this.formShow
        },
        changeShowDate(item){
            return item ? dateFormat(item) : ''
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

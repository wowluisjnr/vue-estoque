module.exports = app => {
    //const {existsOrError} = app.api.validation

    const get = (req, res)=>{
        app.db.select('medicaments.id as medicamentId','medicaments.composition', 'medicaments.unity', 'medicaments.minimumStock', 'lote.expirationDate', 'lote.quantity', 'lote.lotNumber', 'lote.id as loteId')
            .from('medicaments').orderBy('composition')
            .leftJoin('lote',function(){
                this.on('medicaments.id','=','lote.medicamentId')
                .onIn('lote.id', app.db.select('id').from('lote').where('quantity','!=',0))
            })
            .then(inventory => res.json(inventory))
            .catch(err => res.status(500).send(err))        
    }

    const getLotNumbers = (req, res) =>{
        app.db.select('id', 'lotNumber')
            .from('lote')
            .then(lotNumber => res.json(lotNumber))
            .catch(err => res.status(500).send(err)) 

    }

    return { get, getLotNumbers }


}
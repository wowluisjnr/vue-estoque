module.exports = app => {
    //const {existsOrError} = app.api.validation

    const get = (req, res)=>{
        app.db.select('medicaments.id','medicaments.composition', 'medicaments.unity', 'lote.expirationDate', 'lote.quantity')
            .from('medicaments').orderBy('composition')
            .leftJoin('lote','medicaments.id','lote.medicamentId')
            .then(inventory => res.json(inventory))
            .catch(err => res.status(500).send(err))
    }

    return { get }


}
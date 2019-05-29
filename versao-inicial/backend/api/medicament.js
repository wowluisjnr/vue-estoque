module.exports = app =>{
    const { existsOrError } = app.api.validation

    const save = (req, res) =>{
        const medicament = {
            id:req.body.id,
            composition: req.body.composition,
            unity: req.body.unity,
            minimumStock: req.body.minimumStock
        }

        if(req.params.id) medicament.id = req.params.id

        try{
            existsOrError(medicament.composition, 'Composição do Medicamento não informada')
            existsOrError(medicament.unity, 'Unidade do Medicamento não informada')
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(medicament.id){
            app.db('medicaments')
                .update(medicament)
                .where({ id: medicament.id })
                .then(_ => res.status(204).send())
                //.catch( err = res.status(500).send(err))
        } else {
            app.db('medicaments')
                .insert(medicament)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('medicaments').orderBy('composition')
            .then( medicaments => res.json(medicaments))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('medicaments')
            .where({ id: req.params.id })
            .first()
            .then(medicament => res.json(medicament))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}
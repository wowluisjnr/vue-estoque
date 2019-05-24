module.exports = app =>{
    const { existsOrError, notExistsOrError } = app.api.validation

    const save = (req, res) =>{
        const movement = { ...req.body
            // id: req.body.id,
            // lotId: req.body.lotId,
            // quantity: req.body.quantity,
            // entryOrExitDate: req.body.entryOrExitDate,
            // entry: req.body.entry
        }        

        if(req.params.id) movement.id = req.params.id

        try{
            existsOrError(movement.composition, 'Medicamento não informada')
            //existsOrError(movement.unity, 'Unidade do medicamento não informada')
        } catch(msg){
            return res.status(400).send(msg)
        }

        if(movement.id){
            app.db('movements')
                .update(movement)
                .where({ id: movement.id })
                .then(_ => res.status(204).send())
                //.catch( err = res.status(500).send(err))
        } else {
            app.db('movements')
                .insert(movement)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err))
        }
    }

    const get = (req, res) => {
        app.db('movements')
            .then( movements => res.json(movements))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('movements')
            .where({ id: req.params.id })
            .first()
            .then(movement => res.json(movement))
            .catch(err => res.status(500).send(err))
    }

    return { save, get, getById }
}
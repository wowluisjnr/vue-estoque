module.exports = app => {
    const save = (req, res) =>{
        const list_of_order = {
            orderDate: new Date(),
            ubs: 'Felisbela',
            status: 'Enviado'            
        }
        const listMed = req.body

        //console.log(listMed)
        // .then(_ => res.status(204).send())
        // .catch(err => res.status(500).send(err))


        app.db.transaction( trx => {
            app.db('list_of_order').transacting(trx)
            .returning('id')
            .insert(list_of_order)
            .then(res =>                                     
                    app.db('orders')
                        .transacting(trx)
                        .insert(listMed.map(obj =>{
                            return {
                                quantityOrder: obj.quantity,
                                quantitySupplied: 0,
                                medicamentId: obj.id,
                                listId: res[0]
                            }
                        }))   
                                             
            )
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .then(_ => res.status(204).send())
        .catch(err => res.status(500).send(err))
    }   

    const getAll = (req, res) =>{
        app.db('list_of_order').orderBy('orderDate')
            .then( list_of_order => res.json(list_of_order))
            .catch(err => res.status(500).send(err))        
    }

    return { save, getAll }
}
module.exports = app => {
    const save = (req, res) =>{
        const list_of_order = {
            orderDate: new Date(),
            ubs: 'Felisbela',
            status: 'Enviado'            
        }
        const listMed = req.body

        console.log(listMed)
        // .then(_ => res.status(204).send())
        // .catch(err => res.status(500).send(err))


        // if(req.body.orderId){
        //     app.db.transaction( trx => {
        //         app.db('list_of_order').transacting(trx)
        //         .returning('id')
        //         .insert(list_of_order)
        //         .then(res =>                                     
        //                 app.db('orders')
        //                     .transacting(trx)
        //                     .insert(listMed.map(obj =>{
        //                         return {
        //                             quantityOrder: obj.quantity,
        //                             quantitySupplied: 0,
        //                             medicamentId: obj.id,
        //                             listId: res[0]
        //                         }
        //                     }))   
                                                
        //         )
        //         .then(trx.commit)
        //         .catch(trx.rollback)
        //     })
        //     .then(_ => res.status(204).send())
        //     .catch(err => res.status(500).send(err))
        // }
    }   

    const getAll = (req, res) =>{
        //MUDAR STATUS PARA 'EM ATENDIMENTO'
        app.db('list_of_order').orderBy('orderDate')
            .then( list_of_order => {
                res.json(list_of_order)                
            })
            .catch(err => res.status(500).send(err))        
    }

    const getById = (req, res) =>{
        app.db.transaction( trx => {
            app.db('orders').transacting(trx)
            .select('orders.id as orderId','medicaments.id as medicamentId', 'medicaments.composition','medicaments.unity', 'quantityOrder', 'quantitySupplied')            
            .where({listId: req.params.id}).orderBy('medicaments.composition')
            .innerJoin('medicaments', 'medicaments.id','orders.medicamentId')
            .then( orders =>                 
                app.db('list_of_order')
                    .transacting(trx)
                    .where({id: req.params.id})
                    .then( list =>
                        app.db.select('medicamentId').from('lote').sum('quantity as quantity').groupBy('medicamentId')
                            .then( lot => {
                                orders.map( obj => {
                                    obj.quantity = 0
                                    lot.map( l => {
                                        if(obj.medicamentId == l.medicamentId)
                                            obj.quantity = l.quantity
                                    })
                                })
                                res.json({orders, list })
                            })
                    )
                    .then(trx.commit)
                    .catch(trx.rollback)
                    //.then( list => res.json({orders, list}))
                )
                
                                
        })
        .then(_ => console.log('ok'))
        .catch(err => res.status(500).send(err))


        // app.db.select('orders.id', 'medicaments.composition','medicaments.unity', 'quantityOrder', 'quantitySupplied', 'quantity')
        //     .from('orders')
        //     .where({listId: req.params.id}).orderBy('medicaments.composition')
        //     .innerJoin('medicaments', 'medicaments.id','orders.medicamentId')
        //     //.innerJoin('lote', 'lote.medicamentId', 'medicaments.id')            
        //     .leftJoin('lote',function(){
        //         this.on('medicaments.id','=','lote.medicamentId')
        //         //.onIn('lote.medicamentId', app.db.select('lote.medicamentId').from('lote').where('lote.quantity','>',-1)
        //         //.sum('quantity as quantity').groupBy('medicamentId')
        //         //)
        //     //     //this.select('medicamentId').from('lote').sum('quantity').groupBy('medicamentId')
        //     })
        //     .then( listOrder => orders = listOrder)
        //     .catch(err => res.status(500).send(err))
        // app.db('list_of_order')
        //     .where({id: req.params.id})
        //     .then( list => res.json({orders, list}))
        //     .catch(err => res.status(500).send(err))

    }

    return { save, getAll, getById }
}
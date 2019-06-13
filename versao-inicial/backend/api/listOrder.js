module.exports = app => {
    const save =  async (req, res) =>{
        let isFinish = null
        if(req.params.id ){
            console.log("dentro do if")
            isFinish = await app.db('list_of_order').select('id', 'ubs')
                .where({ id: req.params.id, status:'Entregue' }).first()
        }
        const list_of_order = {
            orderDate: new Date(),
            ubs: 'Felisbela',
            status: 'Enviado'            
        }
        const movement = {
            movementDate: new Date(),
            isEntry: false
        }

        const orders = req.body    

        if(!req.params.id){
            app.db.transaction( trx => {
                app.db('list_of_order').transacting(trx)
                .returning('id')
                .insert(list_of_order)
                .then(res =>                                     
                        app.db('orders')
                            .transacting(trx)
                            .insert(orders.map(obj =>{
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
            .catch(err => res.status(500).send('Ocorreu um erro, tente novamente ou contacte o suporte.'))
        } else if(!isFinish) {//if status entrege não fazer

            

            const queries = []
                       
            app.db.transaction(trx =>{
                queries.push(app.db('list_of_order').transacting(trx)
                    .update({status:'Entregue'})
                    .where({id:req.params.id})                    
                    .then(trx.commit) 
                    .catch(trx.rollback))
                    
                orders.forEach( order => {
                    const query = app.db('orders').transacting(trx)
                        .update({quantitySupplied: order.quantitySuppliedTotal ? order.quantitySuppliedTotal : order.quantitySupplied})
                        .where({id: order.orderId})

                    if(order.lotes){ //Registrando saida do lote
                        order.lotes.forEach( lote => {
                            const queryMovements = app.db('movements').transacting(trx)
                                .insert({
                                    movementDate: movement.movementDate,
                                    isEntry: movement.isEntry,
                                    loteId: lote.loteId,
                                    quantity: lote.quantitySupplied
                            })
                            const updateLote = app.db('lote').transacting(trx)
                                .update({quantity: lote.quantity - lote.quantitySupplied })
                                .where({id:lote.loteId})
                            queries.push(queryMovements)
                            queries.push(updateLote)
                            if(lote.quantity< lote.quantitySupplied) res.status(500).send("Problemas")
                        })
                    } else {
                        const queryMovements = app.db('movements').transacting(trx)
                                .insert({
                                    movementDate: movement.movementDate,
                                    isEntry: movement.isEntry,
                                    loteId: order.loteId,
                                    quantity: order.quantitySupplied
                            })
                            const updateLote = app.db('lote').transacting(trx)
                                .update({quantity: order.quantity - order.quantitySupplied })
                                .where({id:order.loteId})
                            queries.push(queryMovements)
                            queries.push(updateLote)
                            if(order.quantity< order.quantitySupplied) res.status(500).send("Problemas")
                    }                    
                                    
                    queries.push(query)                    
                })

                Promise.all(queries) 
                    .then(trx.commit)
                    .catch(trx.rollback);
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))                          
            
        }
        res.status(500).send(`Não é possivel atender O Pedido nº ${isFinish.id} para ${isFinish.ubs}, pois o mesmo já foi finalizado `)
    }   

    const getAll = (req, res) =>{
        //MUDAR STATUS PARA 'EM ATENDIMENTO'
        app.db('list_of_order')
            .where({status:'Enviado' || 'Em atendimento'}).orderBy('orderDate')
            .then( list_of_order => {
                res.json(list_of_order)                
            })
            .catch(err => res.status(500).send(err))        
    }

    const getById = (req, res) =>{
        app.db.transaction( trx => {
            Promise.all([
                app.db('orders').transacting(trx)
                    .select('orders.id as orderId', 'medicaments.id as medicamentId', 
                    'lote.id as loteId','lote.expirationDate', 'lote.lotNumber',
                    'medicaments.composition','medicaments.unity', 'quantityOrder', 'quantitySupplied', 'quantity')
                    .where({listId: req.params.id}).orderBy('medicaments.composition')
                    .innerJoin('medicaments','medicaments.id', 'orders.medicamentId')
                    .leftJoin('lote', function(){
                        this.on('medicaments.id','=','lote.medicamentId')
                        .onIn('lote.id', app.db.select('id').from('lote').where('quantity','!=',0))
                    }).then( orderss => {
                        orderss.forEach(obj =>{
                            if(!obj.quantity)
                                obj.quantity=0
                        })
                        return orderss
                            
                        }),
                    app.db('list_of_order')
                        .transacting(trx)
                        .where({id: req.params.id})
            ])
                .then(trx.commit)
                .catch(trx.rollback)

        })
        
        

        // app.db.transaction( trx => {
        //     app.db('orders').transacting(trx)
        //     .select('orders.id as orderId','medicaments.id as medicamentId', 'medicaments.composition','medicaments.unity', 'quantityOrder', 'quantitySupplied', 'quantity')            
        //     .where({listId: req.params.id}).orderBy('medicaments.composition')
        //     .innerJoin('medicaments', 'medicaments.id','orders.medicamentId')
        //     .leftJoin('lote', 'medicaments.id', 'lote.medicamentId')
        //     .then( orders =>                 
        //         app.db('list_of_order')
        //             .transacting(trx)
        //             .where({id: req.params.id})
        //             .then( list =>
                        
        //                         res.json({orders, list })
                            
        //             )
        //             .then(trx.commit)
        //             .catch(trx.rollback)
        //             //.then( list => res.json({orders, list}))
        //         )
                
                                
        // })
        //.then(_ => console.log('Pedido carregado'))
        .then( orders => res.json(orders))
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
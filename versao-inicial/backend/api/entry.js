module.exports = app =>{
    const { existsOrError } = app.api.validation

    const dateFormat = date => {
        const dia  = date.getDate().toString(),
            diaF = (dia.length == 1) ? '0'+dia : dia,
            mes  = (date.getMonth()+1).toString(),
            mesF = (mes.length == 1) ? '0'+mes : mes,
            anoF = date.getFullYear();
        return `${diaF}/${mesF}/${anoF}`
    }

    const save = (req, res) => {
        //Ao adicionar movimentação, verifica se o 
        //lote movimentado já existe, caso exista altera a 
        //quantidade do lote.
        const entry = { 
            loteId: req.body.loteId,
            quantity: req.body.quantity,
            isEntry: true,
            movementDate: dateFormat(new Date()),
         }     
        const lote = {
            id: req.body.loteId,
            expirationDate: req.body.expirationDate,
            lotNumber: req.body.lotNumber,
            quantity: req.body.quantity,
            medicamentId: req.body.medicamentId
        }   

        //console.log("LOTE - ",lote)
        //.log("ENTRY - ",entry)


        if(req.params.loteId) lote.id = req.params.loteId

        try {
            existsOrError(lote.expirationDate, 'Data de validade não informada')
            existsOrError(lote.lotNumber, 'Numero do lote não informado')
            existsOrError(lote.quantity, 'Quantidade não informada') 
            existsOrError(lote.medicamentId, 'Medicamento não selecionado')  
            existsOrError(entry.movementDate, 'Problemas com a data da movimentação')         
        } catch(msg){
            res.status(400).send(msg)
        }

        if(lote.id){
            console.log('Lote já existe! Deseja somar quantidade a este lote ', lote.id)
        } else {
            app.db.transaction( trx => {
                app.db('lote').transacting(trx)
                .returning('id')
                .insert(lote)
                .then(res => 
                    app.db('movements')
                    .transacting(trx)
                    .insert({
                                ...entry,
                                loteId:res[0]
                            })
                )
                .then(trx.commit)
                .catch(trx.rollback)
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err))
        }       

    }

    const get =(req, res) => {
        //app.db('movements')
        app.db.select('medicaments.composition', 'medicaments.unity', 'movements.movementDate', 'movements.quantity')
            .from('movements')
            .where({ isEntry: true })
            .innerJoin('lote', 'movements.loteId', 'lote.id')
            .innerJoin('medicaments', 'lote.medicamentId', 'medicaments.id')
            .then(movements => res.json(movements))
            .catch(err => res.status(500).send(err))
    }

    //SELECT  me.composition, me.unity, mo."movementDate", mo.quantity FROM movements mo INNER JOIN lote l on l.id=mo."loteId" INNER JOIN medicaments me on l."medicamentId" = me.id;

    //SELECT me.composition, me.unity, l."expirationDate", l.quantity FROM medicaments me INNER JOIN lote l on me.id = l."medicamentId";
    
    //ESSA
    //SELECT m.composition, m.unity, l."expirationDate", l.quantity FROM medicaments m LEFT JOIN lote l ON m.id = l."medicamentId" ;


    return { save, get }
}
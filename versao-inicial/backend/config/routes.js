module.exports = app =>{
    app.route('/medicaments')
        .post(app.api.medicament.save)
        .get(app.api.medicament.get)
    
    app.route('/medicaments/:id')
        .put(app.api.medicament.save)
        .get(app.api.medicament.getById)

    app.route('/entries')
        .post(app.api.entry.save)
        .get(app.api.entry.get)

    app.route('/entries/:id')
        .put(app.api.entry.save)

    app.route('/inventory')
        .get(app.api.inventory.get)

    app.route('/lotes')
        .get(app.api.inventory.getLotNumbers)

    app.route('/order')
        .post(app.api.listOrder.save)
        .get(app.api.listOrder.getAll)
}
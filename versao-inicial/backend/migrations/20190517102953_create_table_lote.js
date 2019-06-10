
exports.up = function(knex, Promise) {
    return knex.schema.createTable('lote', table => {
        table.increments('id').primary()
        table.date('expirationDate').notNull()
        table.string('lotNumber').notNull().unique()
        table.integer('quantity').notNull()
        table.integer('medicamentId').references('id')
            .inTable('medicaments').notNull()
    })  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('lote')    
};

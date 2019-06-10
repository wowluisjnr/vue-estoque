
exports.up = function(knex, Promise) {
    return knex.schema.createTable('movements', table => {
        table.increments('id').primary()
        table.date('movementDate').notNull()
        table.integer('quantity').notNull()
        table.boolean('isEntry').notNull()
        table.integer('loteId').references('id')
            .inTable('lote').notNull()
    })  
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('movements')  
};

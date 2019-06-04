
exports.up = function(knex, Promise) {
    return knex.schema.createTable('orders', table => {
        table.increments('id').primary()
        table.integer('quantityOrder').notNull()
        table.integer('quantitySupplied').notNull()
        table.integer('medicamentId').references('id')
            .inTable('medicaments').notNull()
        table.integer('listId').references('id')
            .inTable('list_of_order')
    })  
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('orders')  
  
};

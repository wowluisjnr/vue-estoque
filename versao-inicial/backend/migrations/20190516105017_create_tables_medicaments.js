
exports.up = function(knex, Promise) {
    return knex.schema.createTable('medicaments', table => {
        table.increments('id').primary()
        table.string('composition').notNull().unique()
        table.enu('unity', ['CP', 'FR', 'GTS', 'AMP']).notNull()
        table.integer('minimumStock').notNull().defaultTo(0)
    })
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('medicaments')  
};

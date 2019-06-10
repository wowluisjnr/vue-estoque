
exports.up = function(knex, Promise) {
    return knex.schema.createTable('list_of_order', table => {
        table.increments('id').primary()
        table.date('orderDate').notNull()
        table.string('ubs').notNull()        
        table.enu('status',['Enviado', 'Em atendimento', 'Entregue']).notNull()
        table.integer('userId').references('id')
            .inTable('users')
            
    }) 
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('list_of_order')  
  
};

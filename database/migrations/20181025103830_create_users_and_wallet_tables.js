
exports.up = function(knex, Promise) {
    return knex.schema
    //users table
    .createTable('users', function(table){
        table.increments();
        table.string('username').unique().notNullable();
    })
    
    //history of coin values same for all users and wallets (if we want to run call from server)
    .createTable('coin_values', function (table) {
        table.string('time_value').primary();
        table.float('c1_value', 12, 4).defaultTo(0);
        table.float('c2_value', 12, 4).defaultTo(0);
        table.float('c3_value', 12, 4).defaultTo(0);
        table.float('c4_value', 12, 4).defaultTo(0);
        table.float('c5_value', 12, 4).defaultTo(0);
    })

    //the wallet info and amount of coins currently in the wallet
    .createTable('wallets', function(table) { 
        table.increments();
        table.string('user_id').references('username').inTable('users');
        table.string('timestamp').references('time_value').inTable('coin_values');
        table.float('c1_amount', 12, 4).defaultTo(0);
        table.float('c2_amount', 12, 4).defaultTo(0);
        table.float('c3_amount', 12, 4).defaultTo(0);
        table.float('c4_amount', 12, 4).defaultTo(0);
        table.float('c5_amount', 12, 4).defaultTo(0);
    });
}

exports.down = function(knex, Promise) {
    console.log('TEARING IT DOWN')
  return knex.schema
    .dropTableIfExists('wallets')
    .dropTableIfExists('coin_values')
    .dropTableIfExists('users');
};

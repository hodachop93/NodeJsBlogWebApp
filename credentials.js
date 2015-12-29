var mongo = {
  development :  {
    connectionString: 'mongodb://localhost/BlogWebApp',
  },
  production : {
    connectionString: 'your_production_connection_string',
  }
}

module.exports = mongo;
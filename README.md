# Owen News API

### <a href='https://owen-news.herokuapp.com/api'>Explore a Hosted Version</a>

Owen News API is a PostgreSQL articles and comments handling API using express. It was built as a portfolio project during the Northcoders Skills bootcamp. A full list of endpoints can be accessed in the endpoints.json, or by visiting /api in the hosted version. It was built using test driven development, and tests can be run by typing "npm t" in the terminal.

# To Use: 

This repo can be cloned from the github repo by navigating to your chosen directory and typing the following command line instruction:
```
git clone https://github.com/OwenPortfolio/be-nc-news
```

Dependencies can be installed by typing `npm i` in the install directory.

This project uses dotenv and requires creating [.env.test] and [.env.development] files containing [PGDATABASE=<database_name_here] for your development and test databases. 

For further information consult the dotenv documentation here: 

(https://www.npmjs.com/package/dotenv)

To setup and seed the database, type `npm run setup-dbs`, then `npm run seed`. 

# Required Dependencies

Requires Node v17.7.1 and Postgres v12.10.

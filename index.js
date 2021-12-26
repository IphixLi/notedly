const express = require('express');
const helmet=require('helmet');
const cors=require('cors');
const {ApolloServer}=require('apollo-server-express');
const depthLimit=require('graphql-depth-limit');
const {createComplexityLimitRule}=require('graphql-validation-complexity');
const jwt=require('jsonwebtoken');
require('dotenv').config();


const db=require('./db');
const models=require('./models');
//a schema, using Graphql schema language
const typeDefs=require('./schema');
//resolvers for schema fields
const resolvers=require('./resolvers');


const port = process.env.PORT || 4000; //reset to 4000 when port is not found
const DB_HOST=process.env.DB_HOST; 
//verify user info with jwt

const app = express();
app.use(helmet());
app.use(cors());

//connect to database
db.connect(DB_HOST)

//get user info from JWT
const getUser= token =>{
if(token){
  try{
    return jwt.verify(token,process.env.JWT_SECRET);
  }catch(err){
    throw new Error('Session invalid');
  }
}
};

//Apollo server setup
const server=new ApolloServer({
  typeDefs,
  resolvers,
  validationRules:[depthLimit(5),createComplexityLimitRule(1000)],
  context: ({ req })=> {
    //get user tokens from headers
    const token=req.headers.authorization;
    //try retrieve user with token
    const user= getUser(token);
    console.log(user);
    //add db models and user to context
    return {models,user};
  },
});

//Apollo Apollo middleware
server.start().then(res => {
      server.applyMiddleware({app,path:'/server'});
app.listen({port}, () =>
  console.log(`Server running at http://localhost:${port}${server.graphqlPath}`))
});
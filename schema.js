const {gql}=require('apollo-server-express');
module.exports=gql`
scalar DateTime
type Query{
  notes:[Note!]!
  note(id:ID!):Note!
  users:[User!]!
  user(username:String!):User
  me:User!
  togleFavorite:[Note!]!
  noteFeed(cursor:String):noteFeed
}

type Note{
  id:ID!
  content:String!
  author:User!
  createdAt:DateTime!
  updatedAt:DateTime!
  favoriteCount:Int!
  favoritedBy:[User!]
},

type User{
  id:ID!
  username:String!
  email:String!
  avatar:String
  notes:[Note!]!
  favorites:[Note!]!

}

type noteFeed{
  notes:[Note!]!
  cursor:String!
  hasNextPage:Boolean!
}
type Mutation{
  newNote(content:String!):Note!,
  updateNote(id:ID!,content:String!):Note!,
  deleteNote(id:ID!):Boolean!,
  deleteAll(author:String!):Boolean!,
  changeAuthor(author:String!,NewAuthor:String!):Boolean!
  signUp(username:String!,email:String!,password:String!):String!
  signIn(username:String!,email:String,password:String!):String!
  toggleFavorite(id:ID!):Note!
}`; //mutation is made using CRUD pattern
//deleteAll and changeAuthor mutations are not required in the book; I just did them.



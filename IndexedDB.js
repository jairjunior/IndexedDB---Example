"use strict";
var dataBase; // Variável Global


function onLoad(){

     /* Testa se a API IndexedDB é suportada pelo navegador */
     if( !window.indexedDB || !window.IDBTransaction || !window.IDBKeyRange ){
          window.alert("Your browser does not support the API IndexedDB.")
          return;
     }

     /* Faz requisição de abertura do banco de dados */
     var request = window.indexedDB.open("myDB", 1);
     
     /* Em caso de SUCESSO */
     request.onsuccess = function(event){
          dataBase = event.target.result;
          console.log("Database 'myDB' successfullt created.")
     }

     /* Em caso de ERRO */
     request.onerror = function(event){
          console.log("Cannot open the database 'myDB'.");
     }

     /* Em caso de atualização ou na criação do banco de dados */
     request.onupgradeneeded = function(event){
          dataBase = event.target.result;
          console.log("Upgrading database...");
         
          /* Se o ObjectStore chamado "books" ainda não existir */
          if( !dataBase.objectStoreNames.contains("books") ){
               let books = dataBase.createObjectStore( "books", { autoIncrement: true } );
               books.createIndex( "title", "title", { unique: false } );
               books.createIndex( "author", "author", { unique: false } );
          }
     }

     /* Ao clicar no botão Submit do formulário de cadastro executa a função includeBook */
     document.getElementById('btnInclude').addEventListener('click', includeBook, false);

}


/*
 * Função que será executada quando apertar o botão "Submit" do formulário de cadastro.
 * Essa função irá pegar os valores dos campos do formulário e irá registrá-los
 * no banco de dados chamados "books".
 */
function includeBook(event){
     event.preventDefault();

     /* Pega valores nos campos do formulário de cadastro de livros */
     var titleField = document.getElementById("titleField");
     var authorField = document.getElementById("authorField");

     /* Faz um request para incluir os valores no banco de dados */
     var transactionHandler = dataBase.transaction( ["books"], "readwrite" ).objectStore("books");
     var request = transactionHandler.add({
          title: titleField.value,
          author: authorField.value
     });

     /* Caso o cadastro seja feito com sucesso */
     request.onsuccess = function(event){
          console.log("Book saved successfully into database.");
          titleField.value = "";
          authorField.value = "";
     }

     /* Se houver erro no cadastro do livro */
     request.onerror = function(e){
          console.log("Cannot save book into the database.");
     }

}


window.addEventListener('load', onLoad, false);
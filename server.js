'use strict'

const express = require('express');

const app = express();

const ejs = require('ejs');

const superagent = require('superagent');

const PORT = process.env.PORT || 8500;

app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true }));

app.get('/', getForm);

app.post('/searches', getBookInfo);

function getForm(request, response) {
  response.render('pages/index');
};

function getBookInfo(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q='

  let typeOfSearch = request.body.search[1];
  let searching = request.body.search[0];
  console.log(request);

  if (typeOfSearch === 'author') {
    url += `+inauthor:${searching}`;
  };

  if (typeOfSearch === 'title') {
    url += `+intitle:${searching}`;
  };

  superagent.get(url)
        .then(data => {
            let book = data.body.items.map(data => new Book(data));
            response.render('pages/searches/show', {books:book});
        })
};

function Book(data) {
  this.title = data.volumeInfo.title? data.volumeInfo.title: "No Title Available";
  this.imgUrl = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail:"https://i.imgur.com/J5LVHEL.jpg";
  this.authors = data.volumeInfo.authors? data.volumeInfo.authors: "No Authors";
  this.description = data.volumeInfo.description? data.volumeInfo.description:"No description available";

  // // `https://i.imgur.com/J5LVHEL.jpg`;
  // this.title = bookObj.title || 'no title available'
  // this.author = bookObj.authors
  // this.description = bookObj.description
};



app.use('*', (request, response) => {
  response.status(404).send('page not found');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));


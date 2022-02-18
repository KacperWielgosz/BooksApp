/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  'use strict'
  // tworze odniesienie do html
  const select = {
    templateOf: {
      books: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      bookImage: 'book__image',
      filters: '.filters',
    },
  }
  // tworze stala templates zawierajaca szablony dla poszczegolnych elementow html
  const templates = {
    templateBook: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML)
  }

  // tworzę klasę dla listy ksiazek
  class BookList {
    constructor(){
      const thisBookList = this;

      thisBookList.initData();
      thisBookList.getElements();
      thisBookList.render();
      thisBookList.initActions();
    }

    initData(){
      const thisBookList = this;
      thisBookList.data = dataSource.books
    }

    getElements(){
      const thisBookList = this;
      thisBookList.dom = {};

      thisBookList.dom.books = document.querySelector(select.containerOf.booksList);
      thisBookList.dom.image = document.querySelector(select.containerOf.bookImage);
      thisBookList.dom.filters = document.querySelector(select.containerOf.filters);

      thisBookList.favouriteBooks = [];
      thisBookList.filters = [];
    }

    render(){
      const thisBookList = this;
      //petla dla wszystkich książek z listy
      for (let book of dataSource.books){
        // generuje html na podstawie templates przekazując mu dane pojedynczej book z datasource.books
        const generatedHTLM = templates.templateBook(book);
        // tworzę element dom z uwzględnieniem wygenerowanego kodu html
        const generatedDOM = utils.createDOMFromHTML(generatedHTLM);
        // znajduję miejscę do umieszczenia elementu dom
        const bookListArea = document.querySelector(select.containerOf.booksList);
        // umieszczam element dom - append child
        bookListArea.appendChild(generatedDOM);
      }
    }

    initActions() {
      const thisBookList = this;

      thisBookList.dom.books.addEventListener('dblclick', function(event){
        event.preventDefault();
        console.log('like')
        const imageParent = event.target.offsetParent
        const imageId = imageParent.getAttribute('data-id')
        if (imageParent.classList.contains(select.containerOf.bookImage)){
          if (! imageParent.classList.contains('favorite')){
            imageParent.classList.add('favorite')
            thisBookList.favouriteBooks.push(imageId)
            console.log(thisBookList.favouriteBooks)
          } else {
            imageParent.classList.remove('favorite');
            const indexToRemove = thisBookList.favouriteBooks.indexOf(imageId)
            thisBookList.favouriteBooks.splice(indexToRemove, 1);
            console.log(thisBookList.favouriteBooks)
          }
        }
      });
      thisBookList.dom.filters.addEventListener('click', function(event){
        const clickedCheckbox = event.target
        if (
          clickedCheckbox.type === 'checkbox' &&
          clickedCheckbox.name === 'filter' &&
          clickedCheckbox.tagName === 'INPUT' &&
          clickedCheckbox.checked === true
        ){
          console.log('check')
          console.log('value:', clickedCheckbox.value)
          console.log('filters:', thisBookList.filters)
          thisBookList.filters.push(clickedCheckbox.value);
        } else if (
          clickedCheckbox.type === 'checkbox' &&
          clickedCheckbox.name === 'filter' &&
          clickedCheckbox.tagName === 'INPUT' &&
          clickedCheckbox.checked !== true
        ){
          const valueIndexToRemove = thisBookList.filters.indexOf(clickedCheckbox.value);
          thisBookList.filters.splice(valueIndexToRemove, 1);
          console.log(thisBookList.filters)
        }
        thisBookList.filter()
      })
      }
      filter(){
        const thisBookList = this;
        for (let book of dataSource.books) {
          let shouldBeHidden = false;
          for (const filter of thisBookList.filters) {
            if(!book.details[filter]) {
              shouldBeHidden = true;
              break;
            }
          }
          const bookImageHide = document.querySelector('.book__image[data-id="'+ book.id + '"]');
          if(shouldBeHidden = true) {
            bookImageHide.classList.add('hidden');
          } else {
            bookImageHide.classList.remove('hidden');
          }
        }
      }
    }
  new BookList;
}

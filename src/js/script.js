/* global Handlebars, utils, dataSource */
/* eslint-disable no-unused-vars */
{
  'use strict';
  const select = {
    templateOf: {
      books: '#template-book',

    },
    containerOf: {
      booksList: '.books-list',
      bookImage: 'book__image',
      filters: '.filters',
    },
  };

  const templates = {
    templateBook: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML)
  };

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
      thisBookList.data = dataSource.books;
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
      for (let book of dataSource.books){
        const ratingBgc = thisBookList.determineRatingBgc(book.rating);
        book.ratingBgc = ratingBgc;

        const ratingWidth = book.rating * 10;
        book.ratingWidth = ratingWidth;

        const generatedHTLM = templates.templateBook(book);
        const generatedDOM = utils.createDOMFromHTML(generatedHTLM);
        const bookListArea = document.querySelector(select.containerOf.booksList);
        bookListArea.appendChild(generatedDOM);
      }
    }

    initActions() {
      const thisBookList = this;
      thisBookList.dom.books.addEventListener('click', function(event){
        event.preventDefault();
      });
      thisBookList.dom.books.addEventListener('dblclick', function(event){
        event.preventDefault();
        const imageParent = event.target.offsetParent;
        const imageId = imageParent.getAttribute('data-id');
        if (
          ! imageParent.classList.contains('favorite') &&
          imageParent.classList.contains(select.containerOf.bookImage)
        ){
          imageParent.classList.add('favorite');
          thisBookList.favouriteBooks.push(imageId);
        } else if (imageParent.classList.contains(select.containerOf.bookImage)){
          imageParent.classList.remove('favorite');
          const indexToRemove = thisBookList.favouriteBooks.indexOf(imageId);
          thisBookList.favouriteBooks.splice(indexToRemove, 1);
        }
      });
      thisBookList.dom.filters.addEventListener('click', function(event){
        const clickedCheckbox = event.target;
        if (
          clickedCheckbox.type === 'checkbox' &&
          clickedCheckbox.name === 'filter' &&
          clickedCheckbox.tagName === 'INPUT' &&
          clickedCheckbox.checked === true
        ){
          thisBookList.filters.push(clickedCheckbox.value);
        } else if (
          clickedCheckbox.type === 'checkbox' &&
          clickedCheckbox.name === 'filter' &&
          clickedCheckbox.tagName === 'INPUT' &&
          clickedCheckbox.checked !== true
        ){
          const valueIndexToRemove = thisBookList.filters.indexOf(clickedCheckbox.value);
          thisBookList.filters.splice(valueIndexToRemove, 1);
        }
        thisBookList.filter();
      });
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
        if(shouldBeHidden) {
          bookImageHide.classList.add('hidden');
        } else {
          bookImageHide.classList.remove('hidden');
        }
      }
    }

    determineRatingBgc(rating){
      if (rating < 6) {
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if (rating > 6 && rating <= 8){
        return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if (rating > 8 && rating <= 9){
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if (rating > 9){
        return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
    }
  }

  const app = new BookList;
}

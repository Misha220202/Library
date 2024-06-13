const list = document.querySelector('.list');
const gallery = document.querySelector('.gallery');
const createBook = document.querySelector('.createBook');
const bookDialog = document.querySelector('#bookDialog');
const form = document.querySelector('form');
const inputs = form.querySelectorAll('fieldset>div>input');
const checkbox = form.querySelector('fieldset>p>input')
const formCancel = form.querySelector('.cancel');
const submit = form.querySelector('button');
const hint = document.querySelector('#hint');
const hintCancel = hint.querySelector('.cancel');

class Book {
    constructor(title, author, pages, readStatus) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.readStatus = readStatus;
    }
}

const book1 = new Book('Think and Grow Rich', 'Napoleon Hill', 320, 'Read');
const book2 = new Book('Dopamine Detox', 'Thibaut Meurisse', 72, 'notRead');
const readArr = [book1];
const notReadArr = [book2];

class BookListNodeManager {
    constructor(element) {
        this.element = element;
    }

    get arr() {
        return this.element.classList.contains('readList') ? readArr : notReadArr;
    }

    set arr(arr) {
        this.arr = arr;
    }

    createNode(book) {
        // This method should be overridden by subclasses
    }

    update() {
        while (this.element.firstChild) {
            this.element.removeChild(this.element.firstChild);
        }
        for (let i = 0; i < this.arr.length; i++) {
            this.element.appendChild(this.createNode(this.arr[i]));
        }
    }

    add(book) {
        this.arr.push(book);
        this.update();
    }

    delete(index) {
        this.arr.splice(index, 1);
        this.update();
    }

    toggleReadStatus(index) {
        const toggledBook = this.arr[index];
        if (toggledBook.readStatus == 'Read') {
            readArr.splice(index, 1);
            toggledBook.readStatus = 'notRead';
            notReadArr.push(toggledBook);
        } else {
            notReadArr.splice(index, 1);
            toggledBook.readStatus = 'Read';
            readArr.push(toggledBook);
        }
        this.update();
    }
}

class ListBinding extends BookListNodeManager{
    createNode(book) {
        const li = document.createElement('li');
        li.textContent = book.title;
        return li;
    }
}

const readList = document.querySelector('.list .readList');
const notReadList = document.querySelector('.list .notReadList');
const readListBinding = new ListBinding(readList);
const notReadListBinding = new ListBinding(notReadList);

class GalleryBinding extends BookListNodeManager {
    createNode(book) {
        const demo = document.querySelector('.book.demo');
        const bookNode = demo.cloneNode(true);
        const title = bookNode.querySelector('.title>.value');
        const author = bookNode.querySelector('.author>.value');
        const pages = bookNode.querySelector('.pages>.value');
        title.textContent = book.title;
        author.textContent = book.author;
        pages.textContent = book.pages;
        bookNode.setAttribute('value', `${book.title}`);
        bookNode.setAttribute('class', `book ${book.readStatus}`);
        return bookNode;
    }
}

const readGallery = document.querySelector('.gallery>.readList');
const notReadGallery = document.querySelector('.gallery>.notReadList');
const readGalleryBinding = new GalleryBinding(readGallery);
const notReadGalleryBinding = new GalleryBinding(notReadGallery);

createBook.addEventListener('click', () => bookDialog.showModal());

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value) input.classList.remove('inValid');
    })
})

function formClose() {
    bookDialog.close();
    inputs.forEach(input => {
        input.value = '';
        input.classList.remove('inValid');
    })
    checkbox.checked = false;
}

formCancel.addEventListener('click', formClose);

hintCancel.addEventListener('click', () => {
    hint.close();
    formClose();
});

function updateAll() {
    readListBinding.update();
    readGalleryBinding.update();
    notReadListBinding.update();
    notReadGalleryBinding.update();
}

submit.addEventListener('click', event => {
    const library = readArr.concat(notReadArr);
    let allValid = true;
    inputs.forEach(input => {
        if (!(input.validity.valid == true && input.value)) {
            event.preventDefault();
            allValid = false;
            input.classList.add('inValid');
        }
    })
    if (library.find(book => book.title == inputs[0].value)) {
        event.preventDefault();
        allValid = false;
        inputs[0].classList.add('inValid');
        hint.showModal();
    }
    if (allValid == true) {
        const title = inputs[0].value;
        const author = inputs[1].value;
        const pages = inputs[2].value;
        const readStatus = checkbox.checked == true ? 'Read' : 'notRead';
        const book = new Book(title, author, pages, readStatus);
        book.readStatus == 'Read' ? readListBinding.add(book) : notReadListBinding.add(book);
        updateAll();
        inputs.forEach(input => input.value = '');
        checkbox.checked = false;
        bookDialog.close();
    }
})

gallery.addEventListener('click', event => {
    const classList = event.target.classList;
    const bookNode = event.target.parentNode.parentNode;
    const parent = bookNode.parentNode;
    const children = parent.children;
    let index = 0;
    for (let i = 0; i < children.length; i++) {
        if (children[i] === bookNode) {
            index = i;
        }
    }
    if (classList.contains('readFlag')) {
        if (bookNode.classList.contains('Read')) {
            readListBinding.toggleReadStatus(index);
        } else {
            notReadListBinding.toggleReadStatus(index);
        }
    } else if (classList.contains('delete')) {
        if (bookNode.classList.contains('Read')) {
            readListBinding.delete(index);
        } else {
            notReadListBinding.delete(index);
        }
    }
    updateAll();
})
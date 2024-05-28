const login = document.querySelector('.login');
login.addEventListener('click', () => location.reload());

const list = document.querySelector('.list');
const readList = document.querySelector('.readList');
const notReadList = document.querySelector('.notReadList');
const books = document.querySelector('.books');
const demo = document.querySelector('.book.demo');
const createBook = document.querySelector('.createBook');
const addBook = document.querySelector('.addBook');
const bookDialog = document.querySelector('#bookDialog');
const form = document.querySelector('form');
const inputs = form.querySelectorAll('fieldset input');
const checkbox = form.querySelector('#read');
const formCancel = form.querySelector('.cancel');
const submit = form.querySelector('button');
const hint = document.querySelector('#hint');
const hintCancel = hint.querySelector('.cancel');

inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.value) input.classList.remove('inValid');
    })
})

function formClose(){
    bookDialog.close();
    inputs.forEach(input => {
        input.value = ''
        input.classList.remove('inValid');
    });
}

formCancel.addEventListener('click', formClose);

hintCancel.addEventListener('click', () => {
    hint.close();
    formClose();
});

function Book(title, author, pages, readStatus) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.readStatus = readStatus;
}

const Library = [new Book('Think and Grow Rich', 'Napoleon Hill', 320, 'Read'), new Book('Dopamine Detox', 'Thibaut Meurisse', 72, 'notRead')];

submit.addEventListener('click', event => {
    let allValid = true;
    inputs.forEach(input => {
        if (!(input.validity.valid == true && input.value)) {
            event.preventDefault();
            allValid = false;
            input.classList.add('inValid');
        }
    })
    if (Library.find(thisBook => thisBook.title == inputs[0].value)) {
        event.preventDefault();
        allValid = false;
        inputs[0].classList.add('inValid');
        hint.showModal();
    }
    if (allValid == true) {
        const book = demo.cloneNode(true);
        const title = book.querySelector('.title>.value');
        const author = book.querySelector('.author>.value');
        const pages = book.querySelector('.pages>.value');
        const li = document.createElement('li');
        title.textContent = inputs[0].value;
        author.textContent = inputs[1].value;
        pages.textContent = inputs[2].value;
        li.textContent = title.textContent;
        book.setAttribute('value', `${title.textContent}`);
        if (checkbox.checked == true) {
            book.setAttribute('class', 'book Read');
            books.insertBefore(book, demo);
            readList.appendChild(li);
        } else {
            book.setAttribute('class', 'book notRead');
            books.insertBefore(book, createBook);
            notReadList.appendChild(li);
        }
        const thisBook = new Book(title.textContent, author.textContent, Number(pages.textContent), book.classList[1]);
        Library.push(thisBook);
        inputs.forEach(input => input.value = '');
        checkbox.checked = false;
        bookDialog.close();
    }
})

books.addEventListener('click', event => {
    const classList = event.target.classList;
    if (classList.contains('addBook')) {
        bookDialog.showModal();
    } else {
        const book = event.target.parentNode.parentNode;
        const value = book.getAttribute('value');
        const listNode = Array.from(list.querySelectorAll('li')).find(li => li.textContent == value);
        const index = Library.findIndex(thisBook => thisBook.title == value);
        if (classList.contains('readFlag')) {
            if (book.classList.contains('Read')) {
                book.classList.remove('Read');
                book.classList.add('notRead');
                books.removeChild(book);
                books.insertBefore(book, createBook);
                readList.removeChild(listNode);
                notReadList.appendChild(listNode);
                Library[index].readStatus = 'notRead';
            } else {
                book.classList.remove('notRead');
                book.classList.add('Read');
                books.removeChild(book);
                books.insertBefore(book, demo);
                notReadList.removeChild(listNode);
                readList.appendChild(listNode);
                Library[index].readStatus = 'Read';
            }
        } else if (classList.contains('delete')) {
            if (book.classList.contains('Read')) {
                readList.removeChild(listNode);
            } else {
                notReadList.removeChild(listNode);
            }
            books.removeChild(book);
            Library.splice(index, 1);
        }
    }
})
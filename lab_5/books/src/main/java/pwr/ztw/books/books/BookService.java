package pwr.ztw.books.books;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pwr.ztw.books.author.Author;
import pwr.ztw.books.author.AuthorRepository;
import pwr.ztw.books.borrow.Borrow;
import pwr.ztw.books.borrow.BorrowRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;
    private final AuthorRepository authorRepository;

    public BookDTO findBookById(Long id) {
        return bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found")).toBookDTO();
    }

    public Page<BookDTO> findAllBooks(Pageable pageable) {
        return bookRepository.findAll(pageable).map(Book::toBookDTO);
    }

    public Book saveBook(NewBookDTO book) {
        Author author = authorRepository.findById(book.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Author not found"));

        Book newBook = book.toBook(author);
        return bookRepository.save(newBook);
    }


    public void deleteBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        List<Borrow> borrows = borrowRepository.findByBook(book);
        borrowRepository.deleteAll(borrows);

        bookRepository.delete(book);
    }


    public Book updateBook(Long id, BookUpdateDTO book) {
        Book oldBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        oldBook.setTitle(book.getTitle());
        oldBook.setPages(book.getPages());
        oldBook.setReleaseDate(book.getReleaseDate());

        Author author = authorRepository.findById(5L)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        oldBook.setAuthor(author);
        return bookRepository.save(oldBook);
    }
}



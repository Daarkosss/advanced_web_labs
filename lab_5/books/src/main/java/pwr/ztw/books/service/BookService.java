package pwr.ztw.books.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pwr.ztw.books.entity.Author;
import pwr.ztw.books.repository.AuthorRepository;
import pwr.ztw.books.entity.Book;
import pwr.ztw.books.repository.BookRepository;
import pwr.ztw.books.entity.Borrow;
import pwr.ztw.books.repository.BorrowRepository;
import pwr.ztw.books.dto.BookDTO;
import pwr.ztw.books.dto.BookUpdateDTO;
import pwr.ztw.books.dto.NewBookDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private static final Logger logger = LoggerFactory.getLogger(BookService.class);
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

        if (book.getTitle() != null) {
            oldBook.setTitle(book.getTitle());
        }
        if (book.getPages() != null) {
            oldBook.setPages(book.getPages());
        }
        if (book.getReleaseDate() != null) {
            oldBook.setReleaseDate(book.getReleaseDate());
        }

        // Update author only if authorId is not null
        if (book.getAuthorId() != null) {
            Author author = authorRepository.findById(book.getAuthorId())
                    .orElseThrow(() -> new RuntimeException("Author not found"));
            oldBook.setAuthor(author);
        }

        return bookRepository.save(oldBook);
    }

}



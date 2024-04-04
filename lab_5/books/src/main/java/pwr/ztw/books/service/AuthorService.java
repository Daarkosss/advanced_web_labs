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
import pwr.ztw.books.dto.AuthorDTO;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;

    public Author   getAuthorById(Long id) {
        return authorRepository.findById(id).orElseThrow(() -> new RuntimeException("Author not found"));
    }

    public Page<Author> getAllAuthors(Pageable pageable) {
        return authorRepository.findAll(pageable);
    }

    public Author createAuthor(AuthorDTO author) {
        return authorRepository.save(author.toAuthor());
    }

    public Author updateAuthor(Long id, AuthorDTO author) {
        if (!authorRepository.existsById(id)) {
            throw new RuntimeException("Author not found");
        }
        Author updatedAuthor = author.toAuthor();
        updatedAuthor.setId(id);
        return authorRepository.save(updatedAuthor);
    }

    public void deleteAuthor(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        List<Book> books = bookRepository.findByAuthor(author);
        books.forEach(book -> {
            Book book1 = bookRepository.findById(book.getId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            List<Borrow> borrows = borrowRepository.findByBook(book1);
            borrowRepository.deleteAll(borrows);
            bookRepository.delete(book);
        });

        authorRepository.deleteById(id);
    }

}
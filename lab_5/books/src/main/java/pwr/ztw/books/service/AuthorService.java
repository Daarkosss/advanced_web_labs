package pwr.ztw.books.service;


import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import pwr.ztw.books.dto.AuthorUpdateDTO;
import pwr.ztw.books.dto.NewAuthorDTO;
import pwr.ztw.books.entity.Author;
import pwr.ztw.books.repository.AuthorRepository;
import pwr.ztw.books.entity.Book;
import pwr.ztw.books.repository.BookRepository;
import pwr.ztw.books.entity.Borrow;
import pwr.ztw.books.repository.BorrowRepository;

import java.util.List;


@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;
    private final BorrowRepository borrowRepository;

    public Author getAuthorById(Long id) {
        return authorRepository.findById(id).orElseThrow(() -> new RuntimeException("Author not found"));
    }

    public Page<Author> getAllAuthors(Pageable pageable) {
        return authorRepository.findAll(pageable);
    }

    public Author createAuthor(NewAuthorDTO author) {
        return authorRepository.save(author.toAuthor());
    }

    public Author updateAuthor(Long id, AuthorUpdateDTO author) {
        Author oldAuthor = authorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Author not found"));

        oldAuthor.setFirstName(author.getFirstName());
        oldAuthor.setLastName(author.getLastName());
        oldAuthor.setCountry(author.getCountry());
        oldAuthor.setBirthDate(author.getBirthDate());

        return authorRepository.save(oldAuthor);
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
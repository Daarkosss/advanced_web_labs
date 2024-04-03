package pwr.ztw.books.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pwr.ztw.books.entity.Author;
import pwr.ztw.books.entity.Book;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAuthor(Author author);
}

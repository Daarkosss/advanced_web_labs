package pwr.ztw.books.books;

import org.springframework.data.jpa.repository.JpaRepository;
import pwr.ztw.books.author.Author;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAuthor(Author author);
}

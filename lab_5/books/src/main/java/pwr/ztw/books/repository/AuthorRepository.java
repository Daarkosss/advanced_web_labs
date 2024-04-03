package pwr.ztw.books.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pwr.ztw.books.entity.Author;

public interface AuthorRepository extends JpaRepository<Author, Long> {
}

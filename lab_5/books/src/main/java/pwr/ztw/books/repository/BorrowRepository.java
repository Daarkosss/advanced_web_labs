package pwr.ztw.books.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pwr.ztw.books.entity.Book;
import pwr.ztw.books.entity.Borrow;

import java.util.List;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    Borrow findFirstByBookOrderByReturnDateDesc(Book book);

    List<Borrow> findByBook(Book book);
}

package pwr.ztw.books.borrow;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pwr.ztw.books.books.Book;

import java.time.LocalDate;
import java.util.List;

public interface BorrowRepository extends JpaRepository<Borrow, Long> {

    Borrow findFirstByBookOrderByReturnDateDesc(Book book);

    List<Borrow> findByBook(Book book);
}

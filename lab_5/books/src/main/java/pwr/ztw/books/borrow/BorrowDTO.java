package pwr.ztw.books.borrow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.books.Book;
import pwr.ztw.books.books.BookDTO;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BorrowDTO {
    private Long id;
    private BookDTO book;
    private LocalDate borrowDate;
    private LocalDate returnDate;

    public Borrow toBorrow() {
        return Borrow.builder()
                .id(id)
                .book(book.toBook())
                .borrowDate(borrowDate)
                .returnDate(returnDate)
                .build();
    }
}

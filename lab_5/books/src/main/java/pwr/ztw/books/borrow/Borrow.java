package pwr.ztw.books.borrow;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.books.Book;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Borrow {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @ManyToOne
    private Book book;
    private LocalDate borrowDate;
    private LocalDate returnDate;

    public BorrowDTO toBorrowDTO() {
        return BorrowDTO.builder()
                .id(id)
                .book(book.toBookDTO())
                .borrowDate(borrowDate)
                .returnDate(returnDate)
                .build();
    }
}

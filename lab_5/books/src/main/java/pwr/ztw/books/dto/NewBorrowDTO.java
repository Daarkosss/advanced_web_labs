package pwr.ztw.books.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.entity.Borrow;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewBorrowDTO {
    private Long bookId;
    private LocalDate returnDate;

    public Borrow toBorrow(BookDTO bookDTO) {
        return Borrow.builder()
                .book(bookDTO.toBook())
                .borrowDate(LocalDate.now())
                .returnDate(returnDate)
                .build();
    }
}

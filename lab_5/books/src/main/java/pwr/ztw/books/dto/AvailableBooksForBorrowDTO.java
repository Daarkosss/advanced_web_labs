package pwr.ztw.books.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.entity.Book;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AvailableBooksForBorrowDTO {
    private Long bookId;
    private String title;
    private String author;

    public AvailableBooksForBorrowDTO toAvailableBooksForBorrowDTO(Book book) {
        return AvailableBooksForBorrowDTO.builder()
                .bookId(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor().getFirstName() + " " + book.getAuthor().getLastName())
                .build();
    }
}
package pwr.ztw.books.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.dto.AvailableBooksForBorrowDTO;
import pwr.ztw.books.dto.BookDTO;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String title;
    @ManyToOne
    private Author author;
    private Integer pages;
    private LocalDate releaseDate;

    public Book of(BookDTO bookDTO) {
        return Book.builder()
                .id(bookDTO.getId())
                .title(bookDTO.getTitle())
                .author(bookDTO.getAuthor().toAuthor())
                .pages(bookDTO.getPages())
                .releaseDate(bookDTO.getReleaseDate())
                .build();
    }

    public BookDTO toBookDTO() {
        return BookDTO.builder()
                .id(id)
                .title(title)
                .author(author.toAuthorDTO())
                .pages(pages)
                .releaseDate(releaseDate)
                .build();
    }

    public AvailableBooksForBorrowDTO toAvailableBooksForBorrowDTO() {
        return AvailableBooksForBorrowDTO.builder()
                .bookId(id)
                .title(title)
                .author(author.getFirstName() + " " + author.getLastName())
                .build();
    }
}

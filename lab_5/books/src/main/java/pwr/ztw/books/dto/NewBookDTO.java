package pwr.ztw.books.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.entity.Author;
import pwr.ztw.books.entity.Book;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NewBookDTO {
    private String title;
    private Long authorId;
    private Integer pages;
    private LocalDate releaseDate;

    public Book toBook(Author author) {
        return Book.builder()
                .title(title)
                .author(author)
                .pages(pages)
                .releaseDate(releaseDate)
                .build();
    }
}

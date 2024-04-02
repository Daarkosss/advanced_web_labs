package pwr.ztw.books.books;

import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.author.Author;
import pwr.ztw.books.author.AuthorDTO;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookDTO {
    private Long id;
    private String title;
    private AuthorDTO author;
    private Integer pages;
    private LocalDate releaseDate;

    public Book toBook() {
        return Book.builder()
                .id(id)
                .title(title)
                .author(author.toAuthor())
                .pages(pages)
                .releaseDate(releaseDate)
                .build();
    }
}

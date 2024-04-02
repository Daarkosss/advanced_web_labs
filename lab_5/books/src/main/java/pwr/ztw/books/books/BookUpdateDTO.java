package pwr.ztw.books.books;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.author.AuthorDTO;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookUpdateDTO {
    private String title;
    private AuthorDTO author;
    private Integer pages;
    private LocalDate releaseDate;
}


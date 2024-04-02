package pwr.ztw.books.author;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pwr.ztw.books.books.Book;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;


import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table
public class Author {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String firstName;
    private String lastName;
    private String country;
    private LocalDate birthDate;
    @OneToMany(mappedBy = "author")
    @JsonIgnoreProperties("author")
    private List<Book> books;

    public AuthorDTO toAuthorDTO() {
        return AuthorDTO.builder()
                .firstName(firstName)
                .lastName(lastName)
                .country(country)
                .birthDate(birthDate)
                .build();
    }

    public AuthorSimpleFormatDTO toAuthorSimpleFormatDTO() {
        return AuthorSimpleFormatDTO.builder()
                .id(id)
                .firstName(firstName)
                .lastName(lastName)
                .build();
    }
}

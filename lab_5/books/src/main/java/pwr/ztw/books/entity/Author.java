package pwr.ztw.books.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import pwr.ztw.books.dto.AuthorDTO;


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
}

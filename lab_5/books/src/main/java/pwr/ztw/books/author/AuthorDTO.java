package pwr.ztw.books.author;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorDTO {
    private String firstName;
    private String lastName;
    private String country;
    private LocalDate birthDate;

    public Author toAuthor() {
        return Author.builder()
                .firstName(firstName)
                .lastName(lastName)
                .country(country)
                .birthDate(birthDate)
                .build();
    }
}

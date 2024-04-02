package pwr.ztw.books.author;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthorSimpleFormatDTO {
    private Long id;
    private String firstName;
    private String lastName;
}

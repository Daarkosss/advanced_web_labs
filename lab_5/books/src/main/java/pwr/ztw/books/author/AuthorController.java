package pwr.ztw.books.author;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/v1/author")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @Operation(summary = "Get author by id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getAuthorById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(authorService.getAuthorById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get all authors")
    @GetMapping("/all")
    public ResponseEntity<?> getAllAuthors(@PageableDefault(page = 0, size = 20) Pageable pageable) {
        return ResponseEntity.ok(authorService.getAllAuthors(pageable));
    }

    @Operation(summary = "Create author, by providing basic author data")
    @PostMapping("/create")
    public ResponseEntity<?> createAuthor(@RequestBody AuthorDTO author) {
        return ResponseEntity.ok().body(authorService.createAuthor(author));
    }

    @Operation(summary = "Update author, by providing id and new author data. Id modification is not allowed.")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAuthor(@PathVariable Long id, @RequestBody AuthorDTO author) {
        try {
            return ResponseEntity.ok(authorService.updateAuthor(id, author));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Delete author by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAuthor(@PathVariable Long id) {
        try {
            authorService.deleteAuthor(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

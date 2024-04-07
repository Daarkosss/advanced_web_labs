package pwr.ztw.books.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import pwr.ztw.books.dto.AuthorUpdateDTO;
import pwr.ztw.books.dto.NewAuthorDTO;
import pwr.ztw.books.service.AuthorService;

import java.util.Collections;


@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class AuthorController {
    private final AuthorService authorService;

    @Operation(summary = "Get author by provided id")
    @GetMapping("/author/{id}")
    public ResponseEntity<?> getAuthorById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(authorService.getAuthorById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorMessage", e.getMessage()));
        }
    }

    @Operation(summary = "Get all authors")
    @GetMapping("/authors")
    public ResponseEntity<?> getAllAuthors(@PageableDefault(page = 0, size = 20) Pageable pageable) {
        return ResponseEntity.ok(authorService.getAllAuthors(pageable));
    }

    @Operation(summary = "Create author based on author data")
    @PostMapping("/author/create")
    public ResponseEntity<?> createAuthor(@RequestBody NewAuthorDTO author) {
        return ResponseEntity.ok().body(authorService.createAuthor(author));
    }

    @Operation(summary = "Update author with provided id with new author data.")
    @PutMapping("/author/{id}")
    public ResponseEntity<?> updateAuthor(@PathVariable Long id, @RequestBody AuthorUpdateDTO author) {
        try {
            return ResponseEntity.ok(authorService.updateAuthor(id, author));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorMessage", e.getMessage()));
        }
    }

    @Operation(summary = "Delete author by provided id")
    @DeleteMapping("/author/{id}")
    public ResponseEntity<?> deleteAuthor(@PathVariable Long id) {
        try {
            authorService.deleteAuthor(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Author deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorMessage", e.getMessage()));
        }
    }

}

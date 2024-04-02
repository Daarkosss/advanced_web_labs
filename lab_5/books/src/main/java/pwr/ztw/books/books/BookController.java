package pwr.ztw.books.books;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import pwr.ztw.books.author.AuthorSimpleFormatDTO;

@RestController
@RequestMapping("/api/v1/book")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @Operation(summary = "Get book by id")
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookService.findBookById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get all books")
    @GetMapping("/all")
    public ResponseEntity<Page<BookDTO>> getAllBooks(@PageableDefault(page = 0, size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.findAllBooks(pageable));
    }
    @Operation(summary = "Create book, by providing basic book data")
    @PostMapping("/create")
    public ResponseEntity<?> createBook(@RequestBody NewBookDTO book) {
        try {
            return ResponseEntity.ok().body(bookService.saveBook(book));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Update book, by providing id and new book data. Id modification is not allowed.")
    @PatchMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookUpdateDTO book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @Operation(summary = "Delete book by id")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBookById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get all authors from db ")
    @GetMapping("/all-authors")
    public ResponseEntity<Page<AuthorSimpleFormatDTO>> getAllAuthors(@PageableDefault(page = 0, size = 10) Pageable pageable, @RequestParam String param) {
    return ResponseEntity.ok(bookService.getAllAuthors(pageable, param));
    }
}

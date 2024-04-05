package pwr.ztw.books.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import pwr.ztw.books.entity.Book;
import pwr.ztw.books.service.BookService;
import pwr.ztw.books.dto.BookDTO;
import pwr.ztw.books.dto.BookUpdateDTO;
import pwr.ztw.books.dto.NewBookDTO;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @Operation(summary = "Get book by provided id")
    @GetMapping("/book/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(bookService.findBookById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get all books")
    @GetMapping("/books")
    public ResponseEntity<Page<BookDTO>> getAllBooks(@PageableDefault(page = 0, size = 20) Pageable pageable) {
        return ResponseEntity.ok(bookService.findAllBooks(pageable));
    }
    @Operation(summary = "Create book based on provided book data")
    @PostMapping("/book/create")
    public ResponseEntity<?> createBook(@RequestBody NewBookDTO book) {
        try {
            return ResponseEntity.ok().body(bookService.saveBook(book));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Update book with provided id with new book data.")
    @PutMapping("/book/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookUpdateDTO book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    @Operation(summary = "Delete book by provided id")
    @DeleteMapping("/book/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBookById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

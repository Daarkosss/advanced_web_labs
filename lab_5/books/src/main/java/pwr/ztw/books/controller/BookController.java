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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;

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
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorMessage", e.getMessage()));
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
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorMessage", e.getMessage()));
        }
    }

    @Operation(summary = "Update book with provided id with new book data.")
    @PutMapping("/book/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody BookUpdateDTO book) {
        Logger logger = LoggerFactory.getLogger(getClass());
        logger.info("Attempting to update book with ID: {}", id);
        logger.debug("Book data received for update: {}", book);
        Book updatedBook;
        try {
            updatedBook = bookService.updateBook(id, book);
            logger.info("Book with ID: {} successfully updated.", id);
        } catch (Exception e) {
            logger.error("Error updating book with ID: {}: {}", id, e.getMessage());
            throw e; // Rethrow to let Spring handle it and possibly translate it to HTTP status
        }

        return ResponseEntity.ok(updatedBook);
    }

    @Operation(summary = "Delete book by provided id")
    @DeleteMapping("/book/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            bookService.deleteBookById(id);
            return ResponseEntity.ok(Collections.singletonMap("message", "Book successfully deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("errorMessage", e.getMessage()));
        }
    }
}

package pwr.ztw.books.controller;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
import pwr.ztw.books.service.BorrowService;
import pwr.ztw.books.dto.AvailableBooksForBorrowDTO;
import pwr.ztw.books.dto.BorrowDTO;
import pwr.ztw.books.dto.NewBorrowDTO;
import pwr.ztw.books.dto.NewReturnDateDTO;


@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BorrowController {
    private final BorrowService borrowService;

    @Operation(summary = "Get borrow details by provided borrow id")
    @GetMapping("/borrow/{id}")
    public ResponseEntity<?> getBorrowById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(borrowService.findBorrowById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Get all borrows, also from the past")
    @GetMapping("/borrows")
    public ResponseEntity<Page<BorrowDTO>> getAllBorrows(@PageableDefault(page = 0, size = 20) Pageable pageable) {
        return ResponseEntity.ok(borrowService.findAllBorrows(pageable));
    }

    @Operation(summary = "Borrow book by providing borrowing data (book cannot be currently borrowed)")
    @PostMapping("/borrow/borrow-book")
    public ResponseEntity<?> borrowBook(@RequestBody NewBorrowDTO borrowDTO) {
        try {
            return ResponseEntity.ok(borrowService.saveBorrow(borrowDTO));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Update return date (you can only set future date)")
    @PatchMapping("/borrow/{id}")
    public ResponseEntity<?> updateBorrowData(@PathVariable Long id, @RequestBody NewReturnDateDTO newReturnDate) {
        try {
            return ResponseEntity.ok(borrowService.updateDueDate(id, newReturnDate));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(summary = "Delete borrow by provided borrow id")
    @DeleteMapping("/borrow/{id}")
    public ResponseEntity<?> deleteBorrow(@PathVariable Long id) {
        try {
            borrowService.deleteBorrowById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}

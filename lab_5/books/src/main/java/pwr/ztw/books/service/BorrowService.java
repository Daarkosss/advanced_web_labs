package pwr.ztw.books.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;
import pwr.ztw.books.entity.Book;
import pwr.ztw.books.repository.BookRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import pwr.ztw.books.entity.Borrow;
import pwr.ztw.books.repository.BorrowRepository;
import pwr.ztw.books.dto.AvailableBooksForBorrowDTO;
import pwr.ztw.books.dto.BorrowDTO;
import pwr.ztw.books.dto.NewBorrowDTO;
import pwr.ztw.books.dto.NewReturnDateDTO;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class BorrowService {
    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;

    public BorrowDTO findBorrowById(Long id) {
        return borrowRepository.findById(id).orElseThrow(() -> new RuntimeException("Borrow not found")).toBorrowDTO();
    }

    public Page<BorrowDTO> findAllBorrows(Pageable pageable) {
        return borrowRepository.findAll(pageable).map(Borrow::toBorrowDTO);
    }

    public Borrow saveBorrow(NewBorrowDTO borrowDTO) {
        Book book = bookRepository.findById(borrowDTO.getBookId()).orElseThrow(() -> new IllegalArgumentException("Book not found"));
        if (isBookAvailableForBorrow(book)) {
            if (borrowDTO.getReturnDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("Return date cannot be from the past");
            }
            Borrow borrow = borrowDTO.toBorrow(book.toBookDTO());
            return borrowRepository.save(borrow);
        } else {
            throw new IllegalArgumentException("The book is not available for borrowing, because it is currently borrowed");
        }
    }

    private boolean isBookAvailableForBorrow(Book book) {
        Borrow latestBorrow = borrowRepository.findFirstByBookOrderByReturnDateDesc(book);
        return latestBorrow == null || latestBorrow.getReturnDate().isBefore(LocalDate.now().minusDays(1));
    }

    public void deleteBorrowById(Long id) {
        if (!borrowRepository.existsById(id)) {
            throw new RuntimeException("Borrow not found");
        }
        borrowRepository.deleteById(id);
    }

    public Borrow updateDueDate(Long id, NewReturnDateDTO newDate) {
        Borrow borrow = borrowRepository.findById(id).orElseThrow(() -> new RuntimeException("Borrow not found"));
        if (newDate.getNewReturnDate().isBefore(LocalDate.now())) {
            throw new RuntimeException("Due date cannot be from the past");
        }
        borrow.setReturnDate(newDate.getNewReturnDate());
        return borrowRepository.save(borrow);
    }

    public Page<AvailableBooksForBorrowDTO> searchBooks(Pageable pageable, String param) {
        List<Book> allBooks = bookRepository.findAll();
        List<AvailableBooksForBorrowDTO> availableBooks = allBooks.stream()
                .filter(book -> book.getTitle().contains(param) ||
                        book.getAuthor().getFirstName().contains(param) ||
                        book.getAuthor().getLastName().contains(param))
                .filter(this::isBookAvailableForBorrow)
                .map(Book::toAvailableBooksForBorrowDTO)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), availableBooks.size());
        return new PageImpl<>(availableBooks.subList(start, end), pageable, availableBooks.size());
    }
}

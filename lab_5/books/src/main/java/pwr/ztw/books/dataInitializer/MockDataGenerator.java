package pwr.ztw.books.dataInitializer;

import com.github.javafaker.Faker;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import pwr.ztw.books.author.Author;
import pwr.ztw.books.author.AuthorRepository;
import pwr.ztw.books.books.Book;
import pwr.ztw.books.books.BookRepository;
import pwr.ztw.books.borrow.Borrow;
import pwr.ztw.books.borrow.BorrowRepository;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
@Slf4j
@Profile("dev")
@RequiredArgsConstructor
public class MockDataGenerator {
    private final BorrowRepository borrowRepository;
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final Faker faker = new Faker(Locale.forLanguageTag("pl"));
    private final Integer NUMBER_OF_ENTITIES_TO_MOCK = 30;


    @PostConstruct
    public void init() {
        log.info("Creating mock data and saving in database...");
        generateMockData();
        log.info("Mock data successfully created!");
        log.info("Mock data will be removed when the server is stopped");
    }

    private void generateMockData() {
        List<Author> authors = createAuthors();
        List<Book> books = createBooks(authors);
        createBorrows(books);
    }

    private List<Author> createAuthors() {
        List<Author> authors = IntStream.rangeClosed(1, NUMBER_OF_ENTITIES_TO_MOCK)
                .mapToObj(i -> Author.builder()
                        .firstName(faker.name().firstName())
                        .lastName(faker.name().lastName())
                        .country(faker.country().name())
                        .birthDate(faker.date().birthday().toInstant().atZone(ZoneId.systemDefault()).toLocalDate())
                        .build())
                .collect(Collectors.toList());
        return authorRepository.saveAll(authors);
    }

    private List<Book> createBooks(List<Author> authors) {
        List<Book> books = IntStream.rangeClosed(1, NUMBER_OF_ENTITIES_TO_MOCK)
                .mapToObj(i -> Book.builder()
                        .title(faker.book().title())
                        .author(authors.get(i - 1))
                        .pages(faker.number().numberBetween(100, 800))
                        .releaseDate(faker.date().past(365, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate())
                        .build())
                .collect(Collectors.toList());
        return bookRepository.saveAll(books);
    }

    private void createBorrows(List<Book> books) {
        IntStream.rangeClosed(1, NUMBER_OF_ENTITIES_TO_MOCK).forEach(i -> {
            LocalDate borrowDate = LocalDate.now().minusDays(faker.number().numberBetween(7, 60));
            Borrow borrow = Borrow.builder()
                    .book(books.get(i - 1))
                    .borrowDate(borrowDate)
                    .returnDate(borrowDate.plusDays(faker.number().numberBetween(2, 60)))
                    .build();
            borrowRepository.save(borrow);
        });
    }
}
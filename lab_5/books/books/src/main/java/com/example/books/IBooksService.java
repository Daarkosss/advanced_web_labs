package com.example.books;

import java.util.Collection;

public interface IBooksService {
    Collection<Book> getBooks();

    public abstract Book getBook(int id);
}

package com.brigada.backend.exception;

public class UsernameAlreadyExistsException extends RuntimeException {
    public UsernameAlreadyExistsException() {
        super();
    }

    public UsernameAlreadyExistsException(String msg) {
        super(msg);
    }
}

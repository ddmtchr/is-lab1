package com.brigada.backend.exception;

public class UsernameAlreadyExistsExpection extends RuntimeException {
    public UsernameAlreadyExistsExpection() {
        super();
    }

    public UsernameAlreadyExistsExpection(String msg) {
        super(msg);
    }
}

package edu.csula.cs594.client.dao;

import java.io.Serializable;

public class GenericResponse {
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    private String message;
}

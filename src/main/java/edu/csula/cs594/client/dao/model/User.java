package edu.csula.cs594.client.dao.model;

public class User {
  private int id;
  private String name;
  private String email;
  private String username;

  public String getHash() {
    return hash;
  }

  public void setHash(String hash) {
    this.hash = hash;
  }

  private String password;
  private String hash;

  public User() {
      this.id = 1;
      this.name = "Demo";
      this.username = "Demo";
      this.email = "Demo@example.com";
  }


  public User(int id, String username, String name, String email) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
  }

    public User(int id, String username, String hash, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.username = username;
        this.hash = hash;
    }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }


  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }
}

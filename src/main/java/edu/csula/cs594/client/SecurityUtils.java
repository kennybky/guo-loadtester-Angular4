package edu.csula.cs594.client;


import edu.csula.cs594.client.dao.model.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.mindrot.jbcrypt.*;
public class SecurityUtils {
    private final static String KEY = "SECRET";

    public static String encodePassword(String rawPassword) {
        return BCrypt.hashpw(rawPassword, BCrypt.gensalt());
    }

    public static boolean checkPassword(String rawPassword, String encodedPassword) {

        return BCrypt.checkpw(rawPassword, encodedPassword);
    }

    public static String createJwtToken( User user ) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("user", user)
                .signWith(SignatureAlgorithm.HS512, KEY)
                .compact();
    }

    public static Object getUser(String token) {
        return Jwts.parser().setSigningKey(KEY).parseClaimsJws(token).getBody().get("user");
    }
}

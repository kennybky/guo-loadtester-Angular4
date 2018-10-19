package edu.csula.cs594.client;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.csula.cs594.client.SecurityUtils;
import edu.csula.cs594.client.dao.model.User;
import org.apache.http.HttpHeaders;

import javax.annotation.Priority;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.Context;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
@JWTTokenNeeded
@Priority(Priorities.AUTHENTICATION)
public class ControllerAdvice implements ContainerRequestFilter {

    @Context private HttpServletRequest httpRequest;



    @Override
    public void filter(ContainerRequestContext containerRequest) throws IOException {

        String bearerToken = containerRequest
                .getHeaderString(HttpHeaders.AUTHORIZATION);
        System.out.println("getting bearer");
        httpRequest.setAttribute("User", new User());

        ObjectMapper mapper =new ObjectMapper();
        try {
            String token = bearerToken.contains("Bearer") ? bearerToken.split("Bearer")[1] : bearerToken;
            User user = mapper.convertValue(SecurityUtils.getUser(token), User.class);
            // insert user object here
            httpRequest.setAttribute("User", user);
        } catch(Exception se) {
            httpRequest.setAttribute("User", new User());
            System.out.println("Here");
        }

    }
}


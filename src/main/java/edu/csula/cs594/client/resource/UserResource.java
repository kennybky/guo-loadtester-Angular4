package edu.csula.cs594.client.resource;

import edu.csula.cs594.client.CliClient;
import edu.csula.cs594.client.DatabaseClient;
import edu.csula.cs594.client.JWTTokenNeeded;
import edu.csula.cs594.client.SecurityUtils;
import edu.csula.cs594.client.dao.model.User;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.Map;


@Path("/user")
public class UserResource {

    private final DatabaseClient dbClient;
    @Context
    private HttpServletRequest request;



    public UserResource(@Context ServletContext context) {
        dbClient = (DatabaseClient) context.getAttribute("dbClient");

    }

    @GET
    @Path("/self")
    @JWTTokenNeeded
    public Response getUser() {
        User user = (User) request.getAttribute("User");
        return Response.ok().entity(user).build();
    }
}

package edu.csula.cs594.client;


import edu.csula.cs594.client.dao.GenericResponse;
import edu.csula.cs594.client.dao.StatusResponse;
import edu.csula.cs594.client.dao.model.User;

import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.sql.SQLException;

@Path("login")
public class LoginService {
    private DatabaseClient dbClient;

    public LoginService(@Context ServletContext context) {
        dbClient = (DatabaseClient) context.getAttribute("dbClient");
    }

    @POST
    @Path("/")
    public Response login(@QueryParam("username") String username, @QueryParam("password") String password){
        GenericResponse r = new GenericResponse();
        try {
            User user =  dbClient.getUser(username);
            if (user == null) {
                r.setMessage("User not found");
                return Response.status(Response.Status.NOT_FOUND).entity(r).build();
            }
            if(SecurityUtils.checkPassword(password, user.getHash())){
                user.setHash(null);
                String token = SecurityUtils.createJwtToken(user);
                r.setMessage(token);
                return Response.ok().entity(r).build();
            } else {
                r.setMessage("Invalid Password");
                return Response.status(Response.Status.BAD_REQUEST).entity(r).build();
            }
        } catch (SQLException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e).build();
        }
    }

}

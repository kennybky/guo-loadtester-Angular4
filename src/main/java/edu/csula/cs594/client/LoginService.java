package edu.csula.cs594.client;


import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;

@Path("login")
public class LoginService {

    @POST
    @Path("/")
    public String login(@QueryParam("username") String Username, @QueryParam("password") String password){
        return null;
    }
}

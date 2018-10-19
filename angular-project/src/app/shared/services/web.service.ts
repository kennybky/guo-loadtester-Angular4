import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class WebService {

  constructor(private http: HttpClient) { }


   getServices() {
    return this.http.get("/v1/service/get");
  }

   saveTestUrl(uri, serviceId = null): Observable<any> {
    var formattedUri;
    if (uri) {
      formattedUri = encodeURIComponent(uri);
    } else {
      formattedUri = "";
    }
    if (serviceId) {
      //save the uri to a service that has attributes used for building the url
      return this.http.get("/v1/service/saveUrlForBuilder?id=" + serviceId + "&uri=" + formattedUri);
    } else {
      //save the uri to the service table, but it has no attributes for building the url
      return this.http.get("/v1/service/saveUrl?uri=" + formattedUri);
    }
  }

  getSavedUrls() {
    return this.http.get("/v1/service/getSavedUrls");
  }

    saveWSDL(name, descriptionUri) {
    if (name == undefined) name = '';
    if (descriptionUri == undefined) {
      descriptionUri = '';
    } else {
      descriptionUri = encodeURIComponent(descriptionUri);
    }
    return this.http.get('/v1/service/save?name=' + name +
      '&descriptionUri=' + descriptionUri);
  }

  serviceDisplays(services) {
    var names = [];
    services.forEach(function (service) {
      if (names.indexOf(service.name) === -1) {
        names.push(service.name);
      }
    });
    return names;
  }

   getMethods (services, name) {
    var methods = [];
    services.forEach(function (service) {
      if (service.name === name) {
        methods.push(service);
      }
    });
    return methods;
  }

   deleteService(service) {
    return this.http.get('/v1/service/delete?id=' + service.id);
  }

   formatParams(services) {
    return services.map(function (service) {
      service.parameters = service.parameters.join(",");
      return service;
    });
  }

   splitServices(services): any{
    var servicesWithBuilder = [];
    var servicesWithoutBuilder = []; ///these are services that aren't configured with a url builder, i.e. only testUri is populated

    services.forEach(function(service) {
      if (service.baseUri !== null && service.baseUri !== undefined) {
        servicesWithBuilder.push(service);
      } else {
        servicesWithoutBuilder.push(service);
      }
    });

    return {
      servicesWithBuilder: servicesWithBuilder,
      servicesWithoutBuilder: servicesWithoutBuilder
    }
  }



}

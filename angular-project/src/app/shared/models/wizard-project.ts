export class WizardProject {
  public id: any;
  public name: any;
  public uri: any;
  public type: any;
  public options: ProjectOptions;
  public method:any;
  public params : any;


  constructor(name, type, uri, options = new ProjectOptions(), method='GET') {
    this.id  = null;
    this.name = name;
    this.type = type;
    this.options = options;
    this.uri = uri;
    this.method = method;
  }

}

export class ProjectOptions {
  constructor(optionType = "scalability") {
    this.optionType = optionType;
  }
  public optionType:String;

  public distribution:any;
  public userCount:any;
public warmUpTime: any;
public testTime: any;
public failuresPermitted: any;
public stepDuration: any;
public stepCount: any;
public timeUnits: any;
public interval: any;
public timeout: any;

}

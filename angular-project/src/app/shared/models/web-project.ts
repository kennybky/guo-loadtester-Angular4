export class WebProject  {
  private id: Number
  public title:string
  public stats: Array<any>
  public dbId: Number
  public description:any;
  public url:string
  public method:string
  public type:any;
  public name:any
  public options:any;
  public service = null
  public parameters:any
  public parameterEntries:any
  public headNode:any
  public nodes:any
  public edges:any
  public cumAvg: Number;
  public running = false;
  public uploadSize;
  public uri;




        static projectTitle(project){
          return project.title || `PROJECT_${project.id}`
        }


        constructor(id) {
          this.id = id;
          this.title = `PROJECT_${id}`;
          this.stats = [];
          this.dbId = null;
          this.description = null;
          this.url = null;
          this.method = "GET";
          this.type = "performance";
          this.name = `PROJECT_${id}`;
          this.options = null;
          this.method = null;
          this.service = null
          this.parameters = {};
          this.parameterEntries = [];
          this.headNode = null;
          this.nodes = [];
          this.edges = [];
          this.uri = ""
        }

        getId(){
          return this.id;
        }
      }


/**
 * A flow data Component
 */
export class FDComponent {
    private id: string;
    private group: string;
    private title: string;
    private color: string;
    private author: string;
    private input: any;
    private output: any;
    private icon: string;
    private version: string;
    private readme: string;
    private click: boolean;
    private options: {};

    /**
     * @param input Can be boolean or an Integer
     * @param output Can be boolean or an Integer
     * @param click Can be activated by click
     * @param options JSON Object or string parsable into JSON Object.
     */
    constructor(id: string, group: string, title: string, color: string, author: string, input: any, output: any, icon: string, version: string, readme: string, click: boolean, options: any) {
        if(input != true && input != false && Number.isNaN(input)){
            throw new Error("Input attribut of FDComponent '" + id + "' should be an integer or boolean value.");
        }
        if(output != true && output != false && Number.isNaN(output)){
            throw new Error("Output attribut of FDComponent '" + id + "' should be an integer or boolean value.");
        }
        try {
            this.options = JSON.parse(options);
        } catch(error) {
            throw new Error("Options attribut of FDComponent '" + id + "' should be a JSON Object value.");
        }
        this.id = id;
        if(group == '' || group == undefined)
            this.group = "Common";
        else
            this.group = group;
        this.title = title;
        this.color = color;
        this.author = author;
        this.input = input;
        this.output = output;
        this.icon = icon;
        this.version = version;
        this.readme = readme;
        this.click = click;
    }

    getId(): string {
        return this.id;
    }

    getGroup(): string {
        return this.group;
    }

    getTitle(): string {
        return this.title;
    }

    getColor(): string {
        return this.color;
    }

    getAuthor(): string {
        return this.author;
    }

    getInput(): any {
        return this.input;
    }

    getOutput(): any {
        return this.output;
    }

    getIcon(): string {
        return this.icon;
    }

    getVersion(): string {
        return this.version;
    }

    getReadme(): string {
        return this.readme;
    }

    isClickable(): boolean {
        return this.click;
    }

    getOptions(): {} {
        return this.options;
    }
}
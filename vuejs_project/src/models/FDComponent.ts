/**
 * A flow data Component
 */
export class FDComponent {
    private id: string;
    private group: string;
    private title: string;
    private color: string;
    private author: string;
    private input: number;
    private output: number;
    private icon: string;
    private version: string;
    private readme: string;
    private click: boolean;
    private options: {};

    /**
     * @param input Can be a positive or null integer (True = 1 and False = 0). Negative value = 0.
     * @param output Can be a positive or null integer (True = 1 and False = 0). Negative value = 0.
     * @param click Can be activated by click
     * @param options JSON Object or string parsable into JSON Object.
     */
    constructor (id: string, group: string, title: string, color: string, author: string, input: boolean | number | string, output: boolean | number | string,
      icon: string, version: string, readme: string, click: boolean, options: string | JSON | null) {
      if (input === true) {
        this.input = 1
      } else if (input === false) {
        this.input = 0
      } else if (Number.isInteger(input)) {
        this.input = (typeof input === 'string') ? Number.parseInt(input) : input
      } else if (!Number.isNaN((typeof input === 'string') ? Number.parseInt(input) : input)) {
        this.input = (typeof input === 'string') ? Number.parseInt(input) : input
      } else if (input.toString().toLowerCase() === 'true') {
        this.input = 1
      } else if (input.toString().toLowerCase() === 'false') {
        this.input = 0
      } else {
        throw new Error("Input attribut of FDComponent '" + id + "' should be an integer or boolean value. Got '" + input + "'.")
      }

      if (this.input < 0) {
        this.input = 0
      }

      if (output === true) {
        this.output = 1
      } else if (output === false) {
        this.output = 0
      } else if (Number.isInteger(output)) {
        this.output = (typeof output === 'string') ? Number.parseInt(output) : output
      } else if (!Number.isNaN((typeof output === 'string') ? Number.parseInt(output) : output)) {
        this.output = (typeof output === 'string') ? Number.parseInt(output) : output
      } else if (output.toString().toLowerCase() === 'true') {
        this.output = 1
      } else if (output.toString().toLowerCase() === 'false') {
        this.output = 0
      } else {
        throw new Error("Output attribut of FDComponent '" + id + "' should be an integer or boolean value. Got '" + output + "'.")
      }

      if (this.output < 0) {
        this.output = 0
      }

      try {
        if (typeof options === 'string') {
          if (options[0] === '{' && options[options.length - 1] === '}') {
            this.options = JSON.parse(options)
          } else {
            this.options = {}
          }
        } else if (typeof options === 'object' && options != null && !(options instanceof Array)) {
          this.options = options
        } else {
          this.options = {}
        }
      } catch (error) {
        // console.log(error)
        this.options = {}
      }

      if (group === '' || group === undefined) {
        this.group = 'Common'
      } else {
        this.group = group
      }

      this.id = id
      this.title = title
      this.color = color
      this.author = author
      this.icon = icon
      this.version = version
      this.readme = readme
      this.click = click
    }

    getId (): string {
      return this.id
    }

    getGroup (): string {
      return this.group
    }

    getTitle (): string {
      return this.title
    }

    getColor (): string {
      return this.color
    }

    getAuthor (): string {
      return this.author
    }

    getInput (): number {
      return this.input
    }

    getOutput (): number {
      return this.output
    }

    getIcon (): string {
      return this.icon
    }

    getVersion (): string {
      return this.version
    }

    getReadme (): string {
      return this.readme
    }

    isClickable (): boolean {
      return this.click
    }

    getOptions (): {} {
      return this.options
    }

    toString (): string {
      return JSON.stringify(this)
    }

    static fromString (s: string): FDComponent {
      const j = JSON.parse(s)
      return new FDComponent(j.id, j.group, j.title, j.color, j.author, j.input, j.output, j.icon, j.version, j.readme, j.click, j.options)
    }
}

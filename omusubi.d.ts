declare module 'omusubi-js' {
  class RawHTMLTagFuncOutput {
    strings: string[];
    values: string[];

    constructor(strings: string[], values: string[]);
  }
  
  export function defineComponent(tagname: string, options?: ElementDefinitionOptions): (wrapped: typeof Component) => void;

  export function html(strings: string[], values: string[]): new () => RawHTMLTagFuncOutput;
  
  export class Store<T extends object> {
    constructor(element: unknown, state?: T);

    update(state: T): void;
  }
  
  export class Component extends HTMLElement {
    static styles: unknown[];

    state: object;

    dispatch(action: string, ...args: unknown[]): Promise<void>;

    connectedCallback(): Promise<void>;

    $ctx(contextId: string): ProviderComponent;
    
    updatecontext(state: object): object;

    setContext(template: Template): void;

    render(props: object): new () => RawHTMLTagFuncOutput;

    update(): Promise<void>;
  }
  
  export class ProviderComponent extends Component {
    providerId: string;

    setContext(template: Template): void;
  }

  class RenderPart {
    constructor(hash: string, temp_hash: string, arg_hash: string);

    remove(): void;

    insertAfter(template: Template): void;
  }

  class Template extends RenderPart {
    constructor(strings: string[]);
  }
}

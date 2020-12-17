declare module 'omusubi-js' {
  class RawHTMLTagFuncOutput {
    strings: string[];
    values: string[];

    constructor(strings: string[], values: string[]);
  }
  
  export function defineComponent(tagname: string, options?: ElementDefinitionOptions): (wrapped: typeof Component) => void;

  export function html(strings: string[], values: string[]): new () => RawHTMLTagFuncOutput;

  export class Dispatcher extends Function {
    constructor(element: unknown, store: unknown);
    
    dispatch(action: string, ...args: string[]): Promise<void>;

    init(): void;

    prop(key: string, default_value: string): string;

    attr(key: string, default_value: string): string;

    updatecontext(state: unknown): object;

    proxy(): object;
  }
  
  export class Store<T extends object> {
    constructor(element: unknown, state?: T);

    setContext(store: unknown): void;

    update(state: T): void;

    proxy(): object;
  }
  
  export class Component extends HTMLElement {
    static dispatcher: typeof Dispatcher;
    static styles: unknown[];

    connectedCallback(): Promise<void>;
    
    setContext(template: Template): void;

    render(state: object, dispatch: unknown): new () => RawHTMLTagFuncOutput;

    update(): Promise<void>;
  }
  
  export class ProviderComponent extends Component {
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

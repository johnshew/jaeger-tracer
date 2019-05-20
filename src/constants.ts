export class Constants {
    public static jeagerClsNamespace = 'jaegar-tracer-restify-cls';

    /**
     * context keys
     */
    public static mainSpan = 'main-span';
    public static tracer = 'tracer';
    public static parentContext = 'parent-context';

    public static httpObjects: { http: any, https: any };
}

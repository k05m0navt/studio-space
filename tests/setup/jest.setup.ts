import { fetch, Request, Response, Headers } from '@whatwg-node/fetch';
(global as any).fetch = fetch as any;
(global as any).Request = Request as any;
(global as any).Response = Response as any;
(global as any).Headers = Headers as any;

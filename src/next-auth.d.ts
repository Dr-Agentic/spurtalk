declare module 'next-auth' {
  export default function handler(req, res: any) { }
  export const getServerSession: any;
  export type NextAuthOptions = any;
}

declare module 'next-auth/server' {
  export { auth } from 'next-auth';
}

declare module 'next-auth/providers/google' {
  export default any;
}

declare module 'next-auth/providers/github' {
  export default any;
}

declare module 'next-auth/providers/email' {
  export default any;
}

declare module 'next/server' {
  export class NextRequest extends Request {}
  export class NextResponse extends Response {}
}
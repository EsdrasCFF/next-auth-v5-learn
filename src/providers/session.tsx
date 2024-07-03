import { SessionProvider as _SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode
}

export function Session_Provider({children}: Props) {
  return (
    <_SessionProvider>
      {children}
    </_SessionProvider>
  )
}
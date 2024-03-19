import { useLoaderData } from '@remix-run/react'
import React from 'react'
import { Toaster, toast } from 'sonner'

export const Toast = () => {
  const calledOnce = React.useRef(false)
  const { message }: { message: string } = useLoaderData()

  // source: https://stackoverflow.com/a/72953313/6141587 & https://www.robinwieruch.de/react-useeffect-only-once/
  React.useEffect(() => {
    if (calledOnce.current) return
    calledOnce.current = true

    if (message) {
      toast.success(message)
    }
  }, [message])

  return <Toaster position="top-center" />
}

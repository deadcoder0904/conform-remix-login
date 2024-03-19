import { LoaderFunctionArgs, json } from '@remix-run/node'
import { Link } from '@remix-run/react'

import { Toast } from '~/components/Toast'
import { SESSION_MESSAGE } from '~/routes/_index'
import { commitToastSession, getToastSession } from '~/utils/toast.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getToastSession(request)
  const message = session.get(SESSION_MESSAGE) || null

  const headers = new Headers()
  if (message) {
    headers.append('Set-Cookie', await commitToastSession(session))
  }

  return json({ message }, { headers })
}

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl">Dashboard</h1>
      <p className="mt-2 mb-4 text-sm">Congrats, you are logged in!</p>
      <Link to="/" className="text-md text-sky-500 underline">
        Go back
      </Link>
      <Toast />
    </div>
  )
}

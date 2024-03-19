import { Link } from '@remix-run/react'

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl">Dashboard</h1>
      <p className="mt-2 mb-4 text-sm">Congrats, you are logged in!</p>
      <Link to="/" className="text-md text-sky-500 underline">
        Go back
      </Link>
    </div>
  )
}

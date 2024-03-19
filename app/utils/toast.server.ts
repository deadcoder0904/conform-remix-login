import { createCookieSessionStorage } from '@remix-run/node'

const TOAST_SESSION_KEY = 'show_toast'

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: TOAST_SESSION_KEY,
      sameSite: 'lax',
      path: '/',
      httpOnly: true,
      secrets: ['SESSION_SECRET'],
      secure: true,
    },
  })

export function getToastSession(request: Request) {
  return getSession(request.headers.get('Cookie'))
}

export { commitSession as commitToastSession, destroySession }

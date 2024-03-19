import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { ActionFunctionArgs, json, redirect } from '@remix-run/node'
import { Form, useActionData } from '@remix-run/react'
import { z } from 'zod'
import { ErrorMessage } from '~/components/ErrorMessage'

import { useIsPending } from '~/utils/misc'

export const LoginFormSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address'),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters long'),
})

export type User = {
  first_name: string
  last_name: string
  email: string
  password: string
}

export async function login({
  email,
  password,
}: Pick<User, 'email' | 'password'>) {
  return email === 'a@a.com' && password === 'aaaaaa'
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const submission = await parseWithZod(formData, {
    schema: LoginFormSchema.transform(async (data, ctx) => {
      const session = await login(data)
      console.log({ session })
      if (!session) {
        ctx.addIssue({
          path: ['email'],
          code: z.ZodIssueCode.custom,
          message: 'Invalid email or password',
        })
        return z.NEVER
      }
      return { ...data, session }
    }),
    async: true,
  })

  console.log({ submission })
  console.log(submission.status !== 'success')
  if (submission.status !== 'success' || !submission.value?.session) {
    console.log('inside')
    return json(
      { result: submission.reply({ hideFields: ['password'] }) },
      { status: submission.status === 'error' ? 400 : 200 }
    )
  }
  console.log('hi')
  const { session } = submission.value
  if (!session) {
    return json(
      { status: 'error', result: submission.reply() },
      { status: 400 }
    )
  }

  return redirect('/dashboard', {
    headers: {
      'Set-Cookie': 'LoggedIn',
    },
  })
}
export default function Login() {
  const actionData = useActionData<typeof action>()
  const isPending = useIsPending()

  const [form, fields] = useForm({
    id: 'login-form',
    constraint: getZodConstraint(LoginFormSchema),
    lastResult: actionData?.result,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginFormSchema })
    },
    shouldValidate: 'onBlur',
  })

  return (
    <div className="max-w-96">
      <h1 className="pl-2 mb-2 text-3xl text-amber-500">
        Remix + Conform + Login
      </h1>
      <div>
        <Form
          role="form"
          method="POST"
          {...getFormProps(form)}
          className="flex flex-col"
        >
          <input
            {...getInputProps(fields.email, { type: 'email' })}
            id="email"
            aria-label="Enter your email"
            placeholder="email"
            name="email"
            className="p-2 m-2"
          />
          {fields.email.errors && (
            <ErrorMessage>{fields.email.errors}</ErrorMessage>
          )}
          <input
            {...getInputProps(fields.email, { type: 'password' })}
            id="password"
            aria-label="Enter your password"
            placeholder="password"
            name="password"
            className="p-2 m-2"
          />
          {fields.password.errors && (
            <ErrorMessage>{fields.password.errors}</ErrorMessage>
          )}
          <button type="submit" className="underline text-sky-500 py-4">
            {isPending ? 'Loading' : 'Login'}
          </button>
        </Form>
      </div>
    </div>
  )
}

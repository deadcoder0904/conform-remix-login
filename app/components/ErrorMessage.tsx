export function ErrorMessage({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <p
      data-slot="error"
      className={`text-base/6 p-2 m-2 text-red-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-red-500 ${className}`}
    >
      {children}
    </p>
  )
}

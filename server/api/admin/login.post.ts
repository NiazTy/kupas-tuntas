export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { password } = body

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

  if (password === ADMIN_PASSWORD) {
    setCookie(event, "admin_token", "authenticated", {
      httpOnly: true,
      maxAge: 60 * 60 * 24, // 1 day
      path: "/"
    })
    return { success: true }
  } else {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" })
  }
})

import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cards/:path*",
    "/accounts/:path*",
    "/transactions/:path*",
    "/reports/:path*",
    "/api/cards/:path*",
    "/api/accounts/:path*",
    "/api/transactions/:path*",
  ],
}; 
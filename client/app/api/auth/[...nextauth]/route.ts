import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // callbacks: {
  //   async signIn({ account }) {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ token: account.id_token }),
  //     });
  //     return res.ok;
  //   },
  // },
});

export { handler as GET, handler as POST };
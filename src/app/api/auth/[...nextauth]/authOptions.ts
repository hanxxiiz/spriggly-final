import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { SessionStrategy } from "next-auth";

interface MongoUser {
  _id: any;
  username: string;
  email: string;
  hashedPassword?: string;
  password?: string; // For backward compatibility with plain text passwords
  comparePassword: (input: string) => Promise<boolean>;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        await connectDB();

        // Try to find user by email, include both password fields
        const user = await User.findOne({ email: credentials.email })
          .select("+hashedPassword +password") as MongoUser;

        if (!user) {
          throw new Error("No user found with this email");
        }

        let isPasswordValid = false;

        // Check if user has hashed password (new format)
        if (user.hashedPassword) {
          isPasswordValid = await user.comparePassword(credentials.password);
        } 
        // Check if user has plain text password (old format)
        else if (user.password) {
          isPasswordValid = user.password === credentials.password;
        }

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.username, // Use username as the display name
          email: user.email,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id;
      } else if (token) {
        session.user = { id: token.id };
      }
      return session;
    },
  },
}; 
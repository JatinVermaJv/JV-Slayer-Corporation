import CredentialProviders from 'next-auth/providers/credentials'
export const AuthOption = {
    providers: [
        CredentialProviders({
            name: 'credential',
            credentials: {
                name: { label: 'Name', type: 'text'},
                email: { label: 'Email', type: 'text'},
                password: { label: 'Password', type: 'password'}
            },
            async authorize(credentials){
                if (!credentials) {
                    return null;
                }

                const response = await fetch('http://localhost:3001/api/user/createUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: credentials.name,
                        email: credentials.email,
                        password: credentials.password
                    })
                });

                if (!response.ok) {
                    return null;
                }

                const user = await response.json();

                if (user) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    };
                } else {
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: "jwt",
        maxAge: 60 * 60 * 24 , // 1 day
    },
    callbacks: {
        async jwt({ token, user }: { token: any, user?: any }) {
            console.log("JWT Callback", token, user);
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            console.log("Session Callback", session, token);
            session.user.id = token.id;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
}
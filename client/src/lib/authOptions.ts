import CredentialProviders from 'next-auth/providers/credentials'
export const AuthOption = {
    providers: [
        CredentialProviders({
            name: 'credential',
            credentials: {
                email: { label: 'Email', type: 'text'},
                password: { label: 'Password', type: 'password'}
            },
            async authorize(credentials){
                // Auth logic and storing the user in the database

                return {
                    id: '1',
                    name: 'JV-Slayer',
                    email: credentials?.email
                }
            }
        })

    ],
    secret: process.env.NEXTAUTH_SECRET
}
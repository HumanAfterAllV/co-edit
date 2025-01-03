import { SignIn } from "@clerk/nextjs";

export default function SignInPage(): React.JSX.Element {
    return(
        <main className="auth-page">
            <SignIn />
        </main>
    )
}
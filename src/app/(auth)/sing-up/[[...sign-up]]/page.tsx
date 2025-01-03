import { SignUp } from "@clerk/nextjs";

export default function SignUpPage(): React.JSX.Element {
    return(
        <main className="auth-page">
            <SignUp />
        </main>
    )
}
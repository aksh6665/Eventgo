import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <SignIn 
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-primary-500 hover:bg-primary-600',
                        card: 'bg-white',
                    },
                }}
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                afterSignInUrl="/"
            />
        </div>
    );
}
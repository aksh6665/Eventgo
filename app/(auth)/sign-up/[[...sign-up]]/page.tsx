import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <SignUp 
                appearance={{
                    elements: {
                        formButtonPrimary: 'bg-primary-500 hover:bg-primary-600',
                        card: 'bg-white',
                    },
                }}
                path="/sign-up"
                routing="path"
                signInUrl="/sign-in"
                afterSignUpUrl="/"
                redirectUrl="/"
                unsafeMetadata={{
                    username: true,
                    phone: true,
                }}
            />
        </div>
    );
}

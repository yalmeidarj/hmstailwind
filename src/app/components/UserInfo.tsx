import {
    // ClerkProvider,
    SignedIn,
    SignedOut,
    SignInButton,
    UserButton
} from "@clerk/nextjs";

export default function UserInfo() {
    return (
        <>
            <SignedIn>
                {/* Mount the UserButton component */}
                <UserButton />
            </SignedIn>
            <SignedOut>
                {/* Signed out users get sign in button */}
                <SignInButton />
            </SignedOut>

        </>
    );
}
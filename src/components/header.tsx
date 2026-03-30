import { Authenticated, Unauthenticated } from "convex/react";
import { Car } from "lucide-react";
import { SignOutButton } from "./sign-out-button";

type HeaderProps = {
  showLogin: boolean;
  onLoginClick: () => void;
  onLogoClick: () => void;
};

export default function Header({ showLogin, onLoginClick, onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-surface-lowest/80 backdrop-blur-sm h-16 flex justify-between items-center px-6 shadow-[0_1px_0_0_rgba(0,51,77,0.05)]">
      <button
        onClick={onLogoClick}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
          <Car className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-display font-bold text-on-surface">Uber Price Intelligence<span className="text-secondary">AI</span></h2>
      </button>
      <Unauthenticated>
        {!showLogin && (
          <button
            onClick={onLoginClick}
            className="text-sm text-secondary font-medium hover:text-primary transition-colors"
          >
            Entrar
          </button>
        )}
      </Unauthenticated>
      <Authenticated>
        <SignOutButton />
      </Authenticated>
    </header>
  );
}

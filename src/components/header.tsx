import { Authenticated, Unauthenticated } from "convex/react";
import { Car, Bookmark } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SignOutButton } from "./sign-out-button";
import { features } from "../config/features";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-10 bg-surface-lowest/80 backdrop-blur-sm h-16 flex justify-between items-center px-6 shadow-[0_1px_0_0_rgba(0,51,77,0.05)]">
      <Link
        to="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
          <Car className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-display font-bold text-on-surface">Uber Price Intelligence</h2>
      </Link>
      <div className="flex items-center gap-4">
        {features.auth && (
          <Authenticated>
            <Link
              to="/saved-routes"
              className="text-sm text-secondary font-medium hover:text-primary transition-colors flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4" />
              Rotas Salvas
            </Link>
          </Authenticated>
        )}
        {features.auth && (
          <Unauthenticated>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-secondary font-medium hover:text-primary transition-colors"
            >
              Entrar
            </button>
          </Unauthenticated>
        )}
        {features.auth && (
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        )}
      </div>
    </header>
  );
}

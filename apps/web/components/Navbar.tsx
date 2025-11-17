import Link from "next/link";
import Button from "./Button";

export default function Navbar() {
  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold shadow-glow">Ed</div>
        <span className="font-semibold text-lg text-slate-900">EduNews</span>
      </Link>

      <div className="flex items-center gap-3">
        <Link href="/feed" className="text-slate-700 hover:text-slate-900">Browse</Link>
        <Link href="/about" className="text-slate-700 hover:text-slate-900">About</Link>
        <Button variant="outline"><Link href="/login">Login</Link></Button>
        <Button variant="primary"><Link href="/signup">Sign Up</Link></Button>
      </div>
    </nav>
  );
}


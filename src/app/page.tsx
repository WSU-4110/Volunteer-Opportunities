import Link from "next/link"
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <p>Hello World</p>
      <Link href="/api/auth/signin">Login</Link>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, LogOut, Search } from "lucide-react";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setMobileMenuOpen(false);
    router.push(`/services?q=${encodeURIComponent(q)}`);
  };
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/marketplace", label: "Marketplace" },
    { path: "/explore", label: "Explore" },
    { path: "/about", label: "About Us" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#e6ddcd] bg-[#faf6ef]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo serif, « Trip » en italique bleu mer */}
          <Link href="/" className="flex-shrink-0">
            <span className="font-serif text-2xl tracking-tight text-[#1c2430]">
              Calma <em className="italic text-[#1E6091]">Trip</em>
            </span>
          </Link>

          {/* Liens desktop — petites capitales espacées, soulignement sable */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`border-b-2 px-3 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] transition-colors ${
                  pathname === link.path
                    ? "border-[#D4A373] text-[#1c2430]"
                    : "border-transparent text-[#6b6353] hover:border-[#D4A373]/50 hover:text-[#1c2430]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Droite : recherche + auth */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Recherche discrète, assortie au fond ivoire */}
            <form
              onSubmit={submitSearch}
              className="group flex w-44 items-center gap-2 rounded-full border border-[#e6ddcd] bg-white/60 px-3.5 py-1.5 transition-all focus-within:w-56 focus-within:border-[#D4A373] focus-within:bg-white hover:border-[#D4A373]/60"
            >
              <Search className="h-3.5 w-3.5 flex-shrink-0 text-[#9a9284] transition-colors group-focus-within:text-[#D4A373]" />
              <input
                type="search"
                placeholder="Search services"
                aria-label="Search services"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-[#1c2430] outline-none placeholder:text-[#9a9284] [&::-webkit-search-cancel-button]:hidden"
              />
            </form>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex h-11 items-center gap-1.5 px-2 text-sm text-[#1c2430] transition-colors hover:text-[#1E6091]"
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-7 rounded-full border border-[#D4A373]/60 object-cover"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-[#D4A373]/60">
                      <User className="h-4 w-4 text-[#6b6353]" />
                    </div>
                  )}
                  <span>{session.user?.name?.split(" ")[0] ?? "Account"}</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-2 py-1 text-[0.72rem] uppercase tracking-[0.14em] text-[#6b6353] transition-colors hover:text-[#1E6091]"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  aria-label="Sign out"
                  className="flex h-11 w-11 items-center justify-center text-[#6b6353] transition-colors hover:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border border-[#1c2430]/15 py-1.5 pl-4 pr-1.5 text-sm text-[#1c2430] transition-colors hover:border-[#1E6091] hover:text-[#1E6091]"
              >
                <span>Log in</span>
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#D4A373]">
                  <User className="h-4 w-4 text-[#143f5f]" />
                </div>
              </Link>
            )}
          </div>

          {/* Burger mobile */}
          <Dialog.Root open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <Dialog.Trigger asChild>
              <button
                aria-label="Open menu"
                className="flex h-11 w-11 items-center justify-center rounded-lg transition-colors hover:bg-[#e6ddcd]/50 lg:hidden"
              >
                <Menu className="h-5 w-5 text-[#1c2430]" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out lg:hidden" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex h-full w-[85vw] max-w-sm flex-col overflow-y-auto bg-[#faf6ef] p-4 shadow-2xl outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right lg:hidden">
                <div className="mb-3 flex items-center justify-between px-2">
                  <Dialog.Title className="font-serif text-lg text-[#1c2430]">Menu</Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      aria-label="Close menu"
                      className="flex h-11 w-11 items-center justify-center rounded-lg text-[#1c2430] transition-colors hover:bg-[#e6ddcd]/50"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>

                <div className="flex flex-col space-y-1">
                  {/* Recherche mobile */}
                  <form
                    onSubmit={submitSearch}
                    className="mb-3 flex items-center gap-2 rounded-full border border-[#e6ddcd] bg-white px-4 py-2.5"
                  >
                    <Search className="h-4 w-4 flex-shrink-0 text-[#9a9284]" />
                    <input
                      type="search"
                      placeholder="Search services"
                      aria-label="Search services"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent text-base text-[#1c2430] outline-none placeholder:text-[#9a9284] [&::-webkit-search-cancel-button]:hidden"
                    />
                  </form>

                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`rounded-lg px-4 py-3 text-[0.78rem] uppercase tracking-[0.14em] transition-colors ${
                        pathname === link.path
                          ? "bg-[#1E6091]/5 font-semibold text-[#1E6091]"
                          : "text-[#6b6353] hover:bg-[#e6ddcd]/40"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <div className="my-2 h-px bg-[#e6ddcd]" />

                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-4 py-3 text-sm text-[#6b6353] hover:bg-[#e6ddcd]/40"
                      >
                        My Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-lg px-4 py-3 text-sm text-[#6b6353] hover:bg-[#e6ddcd]/40"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          signOut({ callbackUrl: "/" });
                        }}
                        className="mx-4 mt-2 rounded-lg border border-[#e6ddcd] px-4 py-2.5 text-left text-sm text-[#1c2430]"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-lg px-4 py-3 text-sm text-[#6b6353] hover:bg-[#e6ddcd]/40"
                      >
                        Log in
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="mx-4 mt-2 rounded-full bg-[#1E6091] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-[#0e3a5c]"
                      >
                        Sign up
                      </Link>
                    </>
                  )}
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </nav>
  );
};
